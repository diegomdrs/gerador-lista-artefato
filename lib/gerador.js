const util = require('util')
const path = require('path')
const exec = util.promisify(require('child_process').exec)
const fs = require('fs-extra')

const Comando = require('../models/comando-git')
const Arquivo = require('../models/arquivo')
const Tarefa = require('../models/tarefa')
const Artefato = require('../models/artefato')
const SaidaVO = require('../models/saida-vo')

const geradorUtil = require('../util/gerador-util')

const TIPO_MODIFICACAO = require('./constants').TIPO_MODIFICACAO
const TIPO_FILENAME_ARTEFATO = require('./constants').TIPO_FILENAME_ARTEFATO

module.exports = (params) => {

  return {

    gerarListaArtefato: async () => {

      try {
        const listaPromiseComandoGit = await obterListaPromiseComandoGit()
        let listaArquivo = await executarListaPromiseComandoGit(listaPromiseComandoGit)

        listaArquivo = tratarArquivoRenomeado(listaArquivo)
        listaArquivo = tratarArquivoDeletado(listaArquivo)
        listaArquivo = tratarArquivoAdicionado(listaArquivo)

        let listaTarefaAgrupadaPorArtefato = agruparTarefaPorArtefato(listaArquivo)

        if (!params.mostrarDeletados) {
          listaTarefaAgrupadaPorArtefato = removerArtefatoDeletado(listaTarefaAgrupadaPorArtefato)
        }

        if (!params.mostrarRenomeados) {
          listaTarefaAgrupadaPorArtefato = removerArtefatoRenomeado(listaTarefaAgrupadaPorArtefato)
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
  }

  function obterListaSaidaTarefasUmArtefato(listaArtefatoComTarefaMesmoTipo) {

    return listaArtefatoComTarefaMesmoTipo.map((artefato) => {

      let saida = new SaidaVO()
      let totalModificacao = 0
      let tipoAlteracao = ''

      saida.listaNumTarefaSaida = artefato.listaTarefa.map((tarefa) => {
        totalModificacao += tarefa.numeroAlteracao
        tipoAlteracao = tarefa.tipoAlteracao

        return tarefa.numeroTarefa
      })

      let artefatoSaida = new Artefato({
        nomeArtefato: artefato.nomeArtefato,
        nomeNovoArtefato: artefato.nomeNovoArtefato,
        nomeAntigoArtefato: artefato.nomeAntigoArtefato,
        extensao: artefato.extensao,
        tipoAlteracao: tipoAlteracao,
        numeroAlteracao: totalModificacao
      })

      saida.listaArtefatoSaida.push(artefatoSaida)

      return saida
    })
  }

  function obterListaSaidaArtefatosUmaTarefa(listaArtefatoSemTarefaMesmoTipo) {

    return params.listaTarefa.reduce((accumListaSaida, tarefaParam) => {

      // Filtra os artefatos que contem a tarefa do loop
      const listaArtefatoTarefa = listaArtefatoSemTarefaMesmoTipo.filter(artefato =>
        artefato.listaTarefa.some(tarefa =>
          tarefa.numeroTarefa === tarefaParam)
      )

      // Filtra os projetos que estão na lista de artefatos que contem a tarefa do loop
      const listaProjeto = listaArtefatoTarefa.reduce((listaRetorno, artefato) => {
        listaRetorno.add(artefato.nomeProjeto)
        return listaRetorno
      }, new Set())

      // Filtra as extensões que estão na lista de artefatos que contem a tarefa do loop
      const listaTipoArtefato = listaArtefatoTarefa.reduce((listaRetorno, artefato) => {
        listaRetorno.add(artefato.tipoArtefato.tipo)
        return listaRetorno
      }, new Set())

      for (const nomeProjeto of listaProjeto) {

        const listaArtefatoPorProjeto = listaArtefatoTarefa
          .filter((artefatoFilterProjeto) =>
            artefatoFilterProjeto.nomeProjeto === nomeProjeto
          )

        for (const tipoAlteracao of Object.values(TIPO_MODIFICACAO)) {

          for (const tipo of listaTipoArtefato) {

            const saida = foo(tipo, tarefaParam, tipoAlteracao, listaArtefatoPorProjeto)

            if (saida.listaArtefatoSaida.length) {
              accumListaSaida.push(saida)
            }
          }
        }
      }

      return accumListaSaida

    }, []).sort(ordenarListaSaidaPorQuantidadeArtefato)
  }

  function foo(tipo, tarefaParam, tipoAlteracao, listaArtefatoPorProjeto) {

    const saida = new SaidaVO()
    let listaAgrupamento = []

    if (tipo !== TIPO_FILENAME_ARTEFATO.OUTROS) {

      listaAgrupamento = listaArtefatoPorProjeto.filter((artefato) =>
        artefato.tipoArtefato.tipo === tipo
      )
    } else {

      // Filtra as extensões que estão na lista de artefatos
      // const listaExtensao = listaArtefatoPorProjeto.reduce((listaRetorno, artefato) => {
      //   listaRetorno.add(artefato.extensao)
      //   return listaRetorno
      // }, new Set())

      // const listaArtefatoPorExtensao = listaArtefatoPorProjeto
      // .filter((artefatoFilterExtensao) =>
      //   artefatoFilterExtensao.extensao === extensao)
    }

    saida.listaNumTarefaSaida.push(tarefaParam)

    saida.listaArtefatoSaida = obterListaArtefatoSaida(
      tarefaParam, tipoAlteracao, listaAgrupamento)

    return saida
  }

  function obterListaArtefatoSaida(tarefaParam, tipoAlteracao, listaAgrupamento) {
    return listaAgrupamento.reduce((listaRetorno, artefato) => {

      const listaTarefa = artefato.listaTarefa.filter(tarefa =>
        tarefa.numeroTarefa === tarefaParam &&
        tarefa.tipoAlteracao === tipoAlteracao)

      for (const tarefa of listaTarefa) {

        listaRetorno.push(new Artefato({
          nomeArtefato: artefato.nomeArtefato,
          nomeNovoArtefato: artefato.nomeNovoArtefato,
          nomeAntigoArtefato: artefato.nomeAntigoArtefato,
          extensao: artefato.extensao,
          tipoAlteracao: tarefa.tipoAlteracao,
          numeroAlteracao: tarefa.numeroAlteracao
        }))
      }

      return listaRetorno
    }, [])
  }

  function obterTipoArtefato(nomeArtefato) {

    const filename = path.basename(nomeArtefato)
    const extensao = geradorUtil.obterExtensaoArquivo(nomeArtefato)

    const tipo = Object.values(TIPO_FILENAME_ARTEFATO).find((tipoFoo) =>
      filename.match(tipoFoo.regex)
    )

    return {
      extensao: extensao,
      tipo: tipo
    }
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
            new Artefato({
              nomeArtefato: artefato.nomeArtefato,
              listaTarefa: listaTarefaMesmoTipo
            }))
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
            new Artefato({
              nomeArtefato: artefato.nomeArtefato,
              nomeNovoArtefato: artefato.nomeNovoArtefato,
              nomeAntigoArtefato: artefato.nomeAntigoArtefato,
              extensao: artefato.extensao,
              tipoArtefato: artefato.tipoArtefato,
              nomeProjeto: artefato.nomeProjeto,
              listaTarefa: listaTarefaUnicoTipoAlteracao
            }))
        }
      }
    }

    return listaArtefatoUmTipoModificacao
  }

  function agruparTarefaPorArtefato(listaArquivo) {

    return listaArquivo.reduce((accum, arquivoReduce) => {

      const novaTarefa = new Tarefa(
        arquivoReduce.commit.numeroTarefa,
        arquivoReduce.commit.tipoAlteracao)

      const novoArtefato = new Artefato({
        nomeArtefato: arquivoReduce.nomeArquivo,
        nomeNovoArtefato: arquivoReduce.commit.nomeNovoArquivo,
        nomeAntigoArtefato: arquivoReduce.commit.nomeAntigoArquivo,
        extensao: geradorUtil.obterExtensaoArquivo(arquivoReduce.nomeArquivo),
        tipoArtefato: obterTipoArtefato(arquivoReduce.nomeArquivo),
        nomeProjeto: arquivoReduce.nomeProjeto,
        listaTarefa: [novaTarefa]
      })

      if (accum.length === 0) {

        accum = [novoArtefato]

      } else if (accum.length > 0) {

        let artefatoEncontrado = accum.find(artefato =>
          artefato.nomeArtefato === arquivoReduce.nomeArquivo)

        if (artefatoEncontrado) {

          let tarefaEncontrada = artefatoEncontrado.listaTarefa.find(tarefa =>
            tarefa.numeroTarefa === arquivoReduce.commit.numeroTarefa &&
            tarefa.tipoAlteracao === arquivoReduce.commit.tipoAlteracao
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

  function removerArtefatoRenomeado(listaTarefaAgrupadaPorArtefato) {

    return listaTarefaAgrupadaPorArtefato.reduce((accum, artefato) => {

      artefato.listaTarefa = artefato.listaTarefa.filter(tarefa => {
        return !tarefa.isTipoAlteracaoRenomear()
      })

      if (artefato.listaTarefa.length) {
        accum.push(artefato)
      }

      return accum
    }, [])
  }

  function ordenarListaArtefato(artefatoA, artefatoB) {
    return artefatoA.nomeProjeto.localeCompare(artefatoB.nomeProjeto) ||
      artefatoA.obterNomeArtefatoReverso().localeCompare(artefatoB.obterNomeArtefatoReverso())
  }

  function ordenarListaSaidaPorQuantidadeArtefato(saidaA, saidaB) {
    return saidaA.listaArtefatoSaida.length - saidaB.listaArtefatoSaida.length
  }

  async function obterListaPromiseComandoGit() {

    return params.listaProjeto.reduce((accum, caminhoProjeto) => {

      if (fs.existsSync(caminhoProjeto)) {

        accum.push(exec(Comando(caminhoProjeto, params.autor, params.listaTarefa,
          params.mostrarCommitsLocais)))

      } else {
        throw new Error(`Projeto ${caminhoProjeto} não encontrado`)
      }

      return accum
    }, [])
  }

  async function executarListaPromiseComandoGit(listaPromiseComandoGit) {

    let listaCommitArquivo = []

    await Promise.all(listaPromiseComandoGit).then((listaRetornoComandoGit) => {

      for (const index in listaRetornoComandoGit) {

        if (listaRetornoComandoGit[index].stdout) {

          const nomeProjeto = path.basename(params.listaProjeto[index])
          const lista = obterListaCommitArquivo(
            listaRetornoComandoGit[index].stdout, nomeProjeto)

          listaCommitArquivo.push.apply(listaCommitArquivo, lista)
        }
      }
    })

    return listaCommitArquivo
  }

  function obterListaCommitArquivo(saida, nomeProjeto) {

    const listaSaidaTask = saida.split(/\n{2,}/g)

    return listaSaidaTask.reduce((accum, saidaTask) => {

      const numeroTarefa = saidaTask.match(/[^\r\n]+/g)[0].match(/task.*\d/i)[0].match(/\d+/)[0]
      const listaArquivo = saidaTask.match(/[^\r\n]+/g).slice(1)

      accum.push.apply(accum,
        listaArquivo.map(arquivo => new Arquivo(nomeProjeto, numeroTarefa, arquivo)))

      return accum
    }, [])
  }

  function tratarArquivoAdicionado(listaArquivo) {

    return listaArquivo.reduce((listaRetorno, arquivo) => {

      if (arquivo.commit.isTipoAlteracaoAdicionar()) {

        const listaRemover = listaRetorno.filter((arquivoFilter) =>
          arquivoFilter.nomeArquivo === arquivo.nomeArquivo &&
          arquivoFilter.commit.numeroTarefa === arquivo.commit.numeroTarefa &&
          arquivoFilter.commit.isTipoAlteracaoModificacao() &&
          !arquivoFilter.commit.isTipoAlteracaoAdicionar()
        )

        return listaRetorno.filter((arquivoFilter) =>
          !listaRemover.find((arquivoFind) =>
            arquivoFind.nomeArquivo === arquivoFilter.nomeArquivo &&
            arquivoFind.commit.numeroTarefa === arquivoFilter.commit.numeroTarefa &&
            arquivoFind.commit.tipoAlteracao === arquivoFilter.commit.tipoAlteracao
          )
        )
      }

      return listaRetorno

    }, listaArquivo)
  }

  function tratarArquivoRenomeado(listaArquivo) {

    return listaArquivo.reduce((listaRetorno, arquivo) => {

      arquivo.commit.isTipoAlteracaoRenomear() &&

        listaRetorno
          .filter(arquivoFilter =>
            arquivoFilter.nomeArquivo === arquivo.commit.nomeAntigoArquivo)
          .forEach(arquivoRenomeado =>
            arquivoRenomeado.nomeArquivo = arquivo.commit.nomeNovoArquivo)

      return listaRetorno

    }, listaArquivo)
  }

  function tratarArquivoDeletado(listaArquivo) {

    let listaArquivoDeletado = listaArquivo.filter(
      arquivoFilter => arquivoFilter.commit.isTipoAlteracaoDelecao())

    return listaArquivoDeletado.reduce((listaArquivoSaida, arquivoDeletado) => {

      const index = listaArquivo.findIndex(arquivo =>
        arquivo.nomeArquivo === arquivoDeletado.nomeArquivo &&
        arquivo.commit.tipoAlteracao === arquivoDeletado.commit.tipoAlteracao
      )

      listaArquivoSaida = listaArquivo.filter((commitArquivo, indexCommitArquivo) =>
        commitArquivo.nomeArquivo !== arquivoDeletado.nomeArquivo ||
        indexCommitArquivo >= index
      )

      return listaArquivoSaida
    }, listaArquivo)
  }
}