const util = require('util')
const path = require('path')
const exec = util.promisify(require('child_process').exec)
const fs = require('fs-extra')

const ComandoGit = require('../models/comando-git')
const Arquivo = require('../models/arquivo')
const Tarefa = require('../models/tarefa')
const Artefato = require('../models/artefato')
const SaidaVO = require('../models/saida-vo')

const TIPO_MODIFICACAO = require('./constants').TIPO_MODIFICACAO

module.exports = function (params) {

  let gerador = {}

  gerador.gerarListaArtefato = async function () {

    try {
      const listaPromiseComandoGit = await obterListaPromiseComandoGit()
      let listaArquivo = await executarListaPromiseComandoGit(listaPromiseComandoGit)

      tratarArquivoRenomeado(listaArquivo)
      listaArquivo = tratarArquivoDeletado(listaArquivo)

      let listaTarefaAgrupadaPorArtefato = agruparTarefaPorArtefato(listaArquivo)

      if (!params.mostrarDeletados) {
        listaTarefaAgrupadaPorArtefato = removerArtefatoDeletado(listaTarefaAgrupadaPorArtefato)
      }

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

    return listaArtefatoComTarefaMesmoTipo.map((artefato) => {

      let saida = new SaidaVO()
      let totalModificacao = 0
      let tipoAlteracao = ''

      saida.listaNumTarefaSaida = artefato.listaTarefa.map((tarefa) => {
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

    return params.task.reduce((accumListaTarefaComSaida, tarefaParam) => {

      const listaArtefato = listaArtefatoSemTarefaMesmoTipo.filter(artefato =>
        artefato.listaTarefa.some(tarefa =>
          tarefa.numTarefa === tarefaParam)
      )

      for (const tipoAlteracao of Object.values(TIPO_MODIFICACAO)) {

        let saida = new SaidaVO()

        saida.listaNumTarefaSaida.push(tarefaParam)

        saida.listaArtefatoSaida = listaArtefato.reduce((accum, artefato) => {

          const listaTarefa = artefato.listaTarefa.filter(tarefa => {
            return tarefa.numTarefa === tarefaParam &&
              tarefa.tipoAlteracao === tipoAlteracao
          })

          for (const tarefa of listaTarefa) {

            accum.push({
              nomeArtefato: artefato.nomeArtefato,
              nomeNovoArtefato: artefato.nomeNovoArtefato,
              nomeAntigoArtefato: artefato.nomeAntigoArtefato,
              tipoAlteracao: tarefa.tipoAlteracao,
              numeroAlteracao: tarefa.numeroAlteracao
            })
          }

          return accum
        }, [])

        if (saida.listaArtefatoSaida.length) {
          accumListaTarefaComSaida.push(saida);
        }
      }

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

    for (const artefato of listaArtefato) {

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
    }

    return listaArtefatoUmTipoModificacao
  }

  function agruparTarefaPorArtefato(listaArquivo) {

    return listaArquivo.reduce((accum, arquivoReduce) => {

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

          // Sempre pega o último commit do tipo R
          if (arquivoReduce.commit.isTipoAlteracaoRenomear()) {

            artefatoEncontrado.nomeNovoArtefato = arquivoReduce.commit.nomeNovoArquivo
            artefatoEncontrado.nomeAntigoArtefato = arquivoReduce.commit.nomeAntigoArquivo
          }

          if (tarefaEncontrada) {

            tarefaEncontrada.numeroAlteracao += 1

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

  function removerArtefatoDeletado(listaTarefaAgrupadaPorArtefato) {

    return listaTarefaAgrupadaPorArtefato.reduce((accum, artefato) => {

      artefato.listaTarefa = artefato.listaTarefa.filter(tarefa => {
        return !tarefa.isTipoAlteracaoDelecao()
      })

      if (artefato.listaTarefa.length) {
        accum.push(artefato)
      }

      return accum

    }, [])
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

    await Promise.all(listaPromiseComandoGit).then((listaRetornoComandoGit) => {

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

  function tratarArquivoRenomeado(listaArquivo) {

    let listaArquivoRenomeado = listaArquivo.filter(
      arquivoFilter => arquivoFilter.commit.isTipoAlteracaoRenomear())

    for (const arquivoRenomeado of listaArquivoRenomeado) {

      const lista = listaArquivo.filter(arquivo =>
        (arquivo.nomeArquivo === arquivoRenomeado.commit.nomeAntigoArquivo))

      lista.forEach(arquivo =>
        arquivo.nomeArquivo = arquivoRenomeado.commit.nomeNovoArquivo)
    }
  }

  function tratarArquivoDeletado(listaArquivo) {

    let listaArquivoDeletado = listaArquivo.filter(
      arquivoFilter => arquivoFilter.commit.isTipoAlteracaoDelecao())

    return listaArquivoDeletado.reduce((accum, arquivoDeletado) => {

      const index = listaArquivo.findIndex(arquivo =>
        arquivoDeletado.nomeArquivo === arquivo.nomeArquivo &&
        arquivoDeletado.commit.tipoAlteracao === arquivo.commit.tipoAlteracao
      )

      accum = listaArquivo.filter((commitArquivo, indexCommitArquivo) =>
        commitArquivo.nomeArquivo !== arquivoDeletado.nomeArquivo || indexCommitArquivo >= index
      )

      return accum
    }, listaArquivo)
  }

  return gerador
}