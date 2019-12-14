const util = require('util')
const path = require('path')
const exec = util.promisify(require('child_process').exec)

const Tarefa = require('../models/tarefa')
const Artefato = require('../models/artefato')
const Comando = require('../models/comando')

let listaTarefaComSaida = new Set()

module.exports = function (params) {

  let gerador = {}

  gerador.gerarListaArtefato = async function () {

    console.log(params)

    if (params.projeto && params.autor && params.task && params.diretorio) {

      try {
        const listaComandoComStout = await obterListaComandoExecutado()
        let listaArtefato = obterListaTarefaAgrupadaPorArtefato(listaComandoComStout)

        if (!params.mostrarDeletados) {
          listaArtefato = removerArtefatoDeletado(listaArtefato)
        }

        const listaArtefatoTarefaMesmoTipo = filtrarArtefatoTarefaMesmoTipo(listaArtefato)
        const listaArtefatoTarefasIguais = filtrarArtefatoTarefasIguais(listaArtefato)

        return {
          listaArtefatoTarefaMesmoTipo: listaArtefatoTarefaMesmoTipo,
          listaArtefatoTarefasIguais: listaArtefatoTarefasIguais
        }
      } catch (error) {
        throw new Error(error.message)
      }
    }
  }

  /*
  Filtra artefatos com tarefas com o mesmo tipo de modificação. ex.
   
  ---
  Tarefas nº 1189666, 1176490
   
  M	foo-estatico/src/lista-foo.tpl.html
  ---
   
  No exemplo, o artefato lista-foo.tpl.html possui duas tarefas (1189666 e 1176490)
  com o mesmo tipo de modificação ('M' - Modified)
  */
  function filtrarArtefatoTarefaMesmoTipo(listaArtefato) {

    let listaArtefatoTarefaMesmoTipo = []

    listaArtefato.forEach(artefato => {

      if (artefato.listaTarefa.length > 1) {

        const listaTarefaMesmoTipo = artefato.listaTarefa
          .filter((tarefaAtual, indexAtual) => {

            const listaSemTarefaModificacaoAtual = artefato.listaTarefa
              .filter((tarefaFilter, index) =>
                index !== indexAtual
              )

            const retorno = listaSemTarefaModificacaoAtual.some(tarefaSome =>
              tarefaAtual.tipoAlteracao === tarefaSome.tipoAlteracao
            )

            return retorno
          })

        if (listaTarefaMesmoTipo.length) {

          listaArtefatoTarefaMesmoTipo.push(
            new Artefato(artefato.nomeArtefato,
              undefined, listaTarefaMesmoTipo))
        }
      }
    })

    return listaArtefatoTarefaMesmoTipo
  }


  function filtrarArtefatoTarefasIguais(listaArtefato) {

    let listaArtefatoAteUmTipo = []

    listaArtefato.forEach(artefato => {

      if (artefato.listaTarefa.length === 1) {

        listaArtefatoAteUmTipo.push(artefato)

      } else if (artefato.listaTarefa.length > 1) {

        const listaTarefaUnicoTipoAlteracao = artefato.listaTarefa
          .filter((tarefaAtual, indexAtual) => {

            const listaSemTarefaAtual = artefato.listaTarefa
              .filter((tarefaFilter, index) => index !== indexAtual)

            const retorno = listaSemTarefaAtual.some(
              tarefaSome => tarefaAtual.tipoAlteracao === tarefaSome.tipoAlteracao)

            return !retorno
          })

        if (listaTarefaUnicoTipoAlteracao.length) {

          listaArtefatoAteUmTipo.push(
            new Artefato(artefato.nomeArtefato,
              artefato.nomeProjeto, listaTarefaUnicoTipoAlteracao))
        }
      }
    })

    return listaArtefatoAteUmTipo
  }

  function obterListaTarefaAgrupadaPorArtefato(listaComandoExecutado) {

    return listaComandoExecutado.reduce((accum, projeto) => {

      let listaArtefatoProjetoTask = obterListaArtefatoTask(projeto)

      if (accum.length === 0) {

        accum.push.apply(accum, listaArtefatoProjetoTask)

      } else if (accum.length > 0) {

        listaArtefatoProjetoTask.forEach(artefatoNovo => {

          let artefatoEncontrado = accum
            .find(artefatoaccum =>
              artefatoaccum.nomeArtefato === artefatoNovo.nomeArtefato
            )

          if (artefatoEncontrado) {
            artefatoEncontrado.listaTarefa.push.apply(
              artefatoEncontrado.listaTarefa, artefatoNovo.listaTarefa)
          } else {

            accum.push(artefatoNovo)
          }
        })
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

  function obterListaArtefatoTask({ task, nomeProjeto, stdout }) {

    const listaArtefatosSaidaComando = stdout.match(/^([A-Z]{1}|R\d+)\s.*$/gm)

    if (listaArtefatosSaidaComando && listaArtefatosSaidaComando.length) {

      return listaArtefatosSaidaComando.reduce((accum, artefatoSaida) => {

        const tipoAlteracao = artefatoSaida.match(/^\w{1}/g)[0]
        const diretorioProjeto = path.basename(nomeProjeto)
        const arquivoArtefato = artefatoSaida.match(/\s.+/g)[0].match(/\w.+/g)[0]

        const nomeArtefato = arquivoArtefato
          .replace(/^/g, diretorioProjeto + '/')
          .replace(/\s+/g, ' ' + diretorioProjeto + '/')

        const tarefa = new Tarefa(task, tipoAlteracao)
        const artefato = new Artefato(nomeArtefato, nomeProjeto, [tarefa])

        if (accum.length === 0) {

          accum = [artefato]

        } else if (accum.length > 0) {

          let artefatoEncontrado = accum.find(artefato =>
            artefato.nomeArtefato === nomeArtefato)

          if (artefatoEncontrado) {

            let taskModificacaoEncontrada = artefatoEncontrado.listaTarefa.find(tarefa =>
              tarefa.numTarefa === task && tarefa.isTipoAlteracaoModificacao()
            )

            if (taskModificacaoEncontrada && tarefa.isTipoAlteracaoModificacao()) {
              taskModificacaoEncontrada.numeroAlteracao += 1
            } else {
              artefatoEncontrado.listaTarefa.push(tarefa)
            }
          } else {
            accum.push(artefato)
          }
        }

        return accum
      }, [])
    }
  }

  async function obterListaComandoExecutado() {

    let listaComandoExecutado = []

    for (const task of params.task) {

      for (const nomeProjeto of params.projeto) {

        const caminhoProjeto = path.join(params.diretorio, nomeProjeto)

        let comando = 'git -C ' + caminhoProjeto + ' log --regexp-ignore-case --no-merges --author=' +
          params.autor + ' --all --name-status -C --grep=' + task

        let retorno = await exec(comando)

        if (retorno.stdout) {
          listaTarefaComSaida.add(task)
          listaComandoExecutado.push(new Comando(retorno.stdout, nomeProjeto, task, comando))
        }
      }
    }

    return listaComandoExecutado
  }

  return gerador
}