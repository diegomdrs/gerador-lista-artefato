const util = require('util')
const path = require('path')
const exec = util.promisify(require('child_process').exec)
const fs = require('fs-extra')

const ComandoGit = require('../models/comando-git')
const Arquivo = require('../models/arquivo')
const Tarefa = require('../models/tarefa')
const Artefato = require('../models/artefato')
const SaidaVO = require('../models/saida-vo')

module.exports = function (params) {

  let gerador = {}

  gerador.gerarListaArtefato = async function () {

    try {
      const listaPromiseComandoGit = await obterListaPromiseComandoGit()
      let listaCommitArquivo = await executarListaPromiseComandoGit(listaPromiseComandoGit)

      tratarArquivoRenomeado(listaCommitArquivo)
      listaCommitArquivo = tratarArquivoDeletado(listaCommitArquivo)

      let listaTarefaAgrupadaPorArtefato = agruparTarefaPorArtefato(listaCommitArquivo)

      // if (!params.mostrarDeletados) {
      //   listaTarefaAgrupadaPorArtefato = removerArtefatoDeletado(listaTarefaAgrupadaPorArtefato)
      // }

      const listaArtefatoComTarefaMesmoTipo = filtrarArtefatoComTarefaMesmoTipo(listaTarefaAgrupadaPorArtefato)
      const listaArtefatoSemTarefaMesmoTipo = filtrarArtefatoSemTarefaMesmoTipo(listaTarefaAgrupadaPorArtefato)

      const listaSaidaTarefasUmArtefato =
        obterListaSaidaTarefasUmArtefato(listaArtefatoComTarefaMesmoTipo)
      const listaSaidaArtefatosUmaTarefa =
        obterListaSaidaArtefatosUmaTarefa(listaArtefatoSemTarefaMesmoTipo)

      return listaSaidaTarefasUmArtefato.concat(listaSaidaArtefatosUmaTarefa)

    } catch (error) {
      throw new Error(error.message)
    }
  }

  function obterListaSaidaTarefasUmArtefato(listaArtefatoComTarefaMesmoTipo) {

    return listaArtefatoComTarefaMesmoTipo.map(function (artefato) {

      let saida = new SaidaVO()
      let totalModificacao = 0
      let tipoAlteracao = ''

      saida.listaNumTarefaSaida = artefato.listaTarefa.map(
        function (tarefa) {
          totalModificacao += tarefa.numeroAlteracao
          tipoAlteracao = tarefa.tipoAlteracao

          return tarefa.numTarefa
        })

      let artefatoSaida = {
        nomeArtefato: artefato.nomeArtefato,
        nomeNovoArtefato: artefato.nomeNovoArtefato,
        nomeAntigoArtefato: artefato.nomeAntigoArtefato,
        tipoAlteracao: tipoAlteracao,
        numeroAlteracao: totalModificacao
      }

      saida.listaArtefatoSaida.push(artefatoSaida)

      return saida
    })
  }


  function obterListaSaidaArtefatosUmaTarefa(listaArtefatoSemTarefaMesmoTipo) {

    return params.task.reduce(
      (accumListaTarefaComSaida, tarefaParam) => {

        let saida = new SaidaVO()

        saida.listaNumTarefaSaida.push(tarefaParam)

        listaArtefatoSemTarefaMesmoTipo.forEach(artefato => {

          saida.listaArtefatoSaida.push.apply(saida.listaArtefatoSaida,
            artefato.listaTarefa.reduce(function (accum, tarefa) {

              if (tarefaParam === tarefa.numTarefa) {

                let artefatoSaida = {
                  nomeArtefato: artefato.nomeArtefato,
                  nomeNovoArtefato: artefato.nomeNovoArtefato,
                  nomeAntigoArtefato: artefato.nomeAntigoArtefato,
                  tipoAlteracao: tarefa.tipoAlteracao,
                  numeroAlteracao: tarefa.numeroAlteracao
                }

                accum.push(artefatoSaida)

                return accum
              }
            }, []))
        })

        // Só adicionar a lista tarefa com no mínimo um artefato
        if (saida.listaArtefatoSaida.length)
          accumListaTarefaComSaida.push(saida)

        return accumListaTarefaComSaida
      }, [])
  }

  /*
  Filtra artefatos com tarefas com o mesmo tipo de modificação. 
  
  ex. 
  ---
  Tarefas nº 1189666, 1176490
   
  M	2 foo-estatico/src/lista-foo.tpl.html
  ---
   
  No exemplo, o artefato lista-foo.tpl.html possui 2 tarefas (1189666 e 1176490)
  com o mesmo tipo de modificação ('M' - Modified)
  */
  function filtrarArtefatoComTarefaMesmoTipo(listaArtefato) {

    let listaArtefatoTarefaMesmoTipo = []

    for (const artefato of listaArtefato) {

      if (artefato.listaTarefa.length > 1) {

        // TODO - refatorar
        const listaTarefaMesmoTipo = artefato.listaTarefa
          .filter((tarefaAtual, indexAtual) => {

            const listaSemTarefaAtual = artefato.listaTarefa
              .filter((tarefaFilter, index) => index !== indexAtual)

            // Existe alguma outra tarefa com o mesmo tipo da atual?
            const retorno = listaSemTarefaAtual.some(tarefaSome =>
              tarefaAtual.tipoAlteracao === tarefaSome.tipoAlteracao
            )

            return retorno
          })

        if (listaTarefaMesmoTipo.length) {

          listaArtefatoTarefaMesmoTipo.push(
            new Artefato(artefato.nomeArtefato,
              undefined, undefined, undefined,
              listaTarefaMesmoTipo))
        }
      }
    }

    return listaArtefatoTarefaMesmoTipo
  }

  /*
  Filtra artefatos sem tarefas com o mesmo tipo de modificação. 
  
  ex. 
  ---
  Tarefas nº 1189777
   
  M	1 foo-estatico/src/lista-bar.tpl.html
  A	1 foo-estatico/src/lista-bar.tpl.html
  ---
   
  No exemplo, o artefato lista-bar.tpl.html possui tarefas únicas 
  em relação ao tipo de modificação. 'A' (Added) logicamente só aparece uma vez e
  'M' só aparece se o arquivo tiver sido modificado uma vez
  */
  function filtrarArtefatoSemTarefaMesmoTipo(listaArtefato) {

    let listaArtefatoUmTipoModificacao = []

    listaArtefato.forEach(artefato => {

      if (artefato.listaTarefa.length === 1) {

        listaArtefatoUmTipoModificacao.push(artefato)

      } else if (artefato.listaTarefa.length > 1) {

        // TODO - refatorar
        const listaTarefaUnicoTipoAlteracao = artefato.listaTarefa
          .filter((tarefaAtual, indexAtual) => {

            const listaSemTarefaAtual = artefato.listaTarefa
              .filter((tarefaFilter, index) => index !== indexAtual)

            // Existe alguma outra tarefa com o mesmo tipo da atual?
            const retorno = listaSemTarefaAtual.some(
              tarefaSome => tarefaAtual.tipoAlteracao === tarefaSome.tipoAlteracao)

            return !retorno
          })

        if (listaTarefaUnicoTipoAlteracao.length) {

          listaArtefatoUmTipoModificacao.push(
            new Artefato(
              artefato.nomeArtefato,
              artefato.nomeNovoArtefato,
              artefato.nomeAntigoArtefato,
              artefato.nomeProjeto,
              listaTarefaUnicoTipoAlteracao))
        }
      }
    })

    return listaArtefatoUmTipoModificacao
  }

  function agruparTarefaPorArtefato(listaCommitArquivo) {

    return listaCommitArquivo.reduce(function (accum, arquivoReduce) {

      const novaTarefa = new Tarefa(
        arquivoReduce.commit.numTarefa,
        arquivoReduce.commit.tipoAlteracao)

      const novoArtefato = new Artefato(
        arquivoReduce.nomeArquivo,
        arquivoReduce.commit.nomeNovoArquivo,
        arquivoReduce.commit.nomeAntigoArquivo,
        arquivoReduce.nomeProjeto,
        [novaTarefa])

      if (accum.length === 0) {

        accum = [novoArtefato]

      } else if (accum.length > 0) {

        let artefatoEncontrado = accum.find(artefato =>
          artefato.nomeArtefato === arquivoReduce.nomeArquivo)

        if (artefatoEncontrado) {

          let tarefaEncontrada = artefatoEncontrado.listaTarefa.find(tarefa =>
            tarefa.numTarefa === arquivoReduce.commit.numTarefa
            && tarefa.tipoAlteracao === arquivoReduce.commit.tipoAlteracao
          )

          if (tarefaEncontrada) {
            tarefaEncontrada.numeroAlteracao += 1

            if (arquivoReduce.commit.isTipoAlteracaoRenomear()) {

              artefatoEncontrado.nomeNovoArtefato = arquivoReduce.commit.nomeNovoArquivo
              artefatoEncontrado.nomeAntigoArtefato = arquivoReduce.commit.nomeAntigoArquivo
            }

          } else {

            artefatoEncontrado.listaTarefa.push(novaTarefa)
          }

        } else {
          accum.push(novoArtefato)
        }
      }

      return accum

    }, []).sort(ordenarListaArtefato)
  }

  function removerArtefatoDeletado(listaArtefato) {
    return listaArtefato.filter(artefato => {
      return !artefato.listaTarefa.some(tarefa => tarefa.isTipoAlteracaoDelecao())
    })
  }

  function ordenarListaArtefato(artefatoA, artefatoB) {
    return artefatoA.nomeProjeto.localeCompare(artefatoB.nomeProjeto) ||
      artefatoA.getNomeArtefatoReverso().localeCompare(artefatoB.getNomeArtefatoReverso())
  }

  async function obterListaPromiseComandoGit() {

    let listaPromiseComando = []

    for (const caminhoProjeto of params.projeto) {

      if (fs.existsSync(caminhoProjeto)) {

        let comandoGit = new ComandoGit(caminhoProjeto, params.autor, params.task)
        listaPromiseComando.push(exec(comandoGit.comando))

      } else {

        throw new Error('Projeto \'' + caminhoProjeto + '\' não encontrado')
      }
    }

    return listaPromiseComando
  }

  async function executarListaPromiseComandoGit(listaPromiseComandoGit) {

    let listaCommitArquivo = []

    await Promise.all(listaPromiseComandoGit).then(function (listaRetornoComandoGit) {

      for (const index in listaRetornoComandoGit) {

        if (listaRetornoComandoGit[index].stdout) {

          const nomeProjeto = path.basename(params.projeto[index])
          const lista = obterListaCommitArquivo(
            listaRetornoComandoGit[index].stdout, nomeProjeto)

          listaCommitArquivo.push.apply(listaCommitArquivo, lista)
        }
      }
    })

    return listaCommitArquivo
  }

  function obterListaCommitArquivo(saida, nomeProjeto) {

    const listaRetorno = saida.split(/\n{2,}/g)

    return listaRetorno.map(retorno => new Arquivo(nomeProjeto, retorno))
  }

  function tratarArquivoRenomeado(listaCommitArquivo) {

    let listaCommitArquivoRenomeado = listaCommitArquivo.filter(
      arquivoFilter => arquivoFilter.commit.isTipoAlteracaoRenomear())

    for (const arquivoRenomeado of listaCommitArquivoRenomeado) {

      const lista = listaCommitArquivo.filter(arquivo =>
        (arquivo.nomeArquivo === arquivoRenomeado.commit.nomeAntigoArquivo))

      lista.forEach(arquivo =>
        arquivo.nomeArquivo = arquivoRenomeado.commit.nomeNovoArquivo)
    }
  }

  function tratarArquivoDeletado(listaCommitArquivo) {

    let listaCommitArquivoDeletado = listaCommitArquivo.filter(
      arquivoFilter => arquivoFilter.commit.isTipoAlteracaoDelecao())

    return listaCommitArquivoDeletado.reduce((accum, arquivoDeletado) => {

      const index = listaCommitArquivo.findIndex(arquivo =>
        arquivoDeletado.nomeArquivo === arquivo.nomeArquivo &&
        arquivoDeletado.commit.tipoAlteracao === arquivo.commit.tipoAlteracao
      )

      accum = listaCommitArquivo.filter((commitArquivo, indexCommitArquivo) =>
        commitArquivo.nomeArquivo !== arquivoDeletado.nomeArquivo || indexCommitArquivo >= index
      )

      return accum
    }, [])
  }

  return gerador
}