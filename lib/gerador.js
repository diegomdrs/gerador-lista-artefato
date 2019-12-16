const util = require('util')
const path = require('path')
const exec = util.promisify(require('child_process').exec)

const Tarefa = require('../models/tarefa')
const Artefato = require('../models/artefato')
const Comando = require('../models/comando')
const Foo = require('../models/foo')

module.exports = function (params) {

  let gerador = {}

  gerador.listaTarefaComSaida = new Set()

  gerador.gerarListaArtefato = async function () {

    if (params.projeto && params.autor && params.task && params.diretorio) {

      try {
        const listaComandoComStout = await obterListaComandoExecutado()
        let listaArtefato = obterListaTarefaAgrupadaPorArtefato(listaComandoComStout)

        if (!params.mostrarDeletados) {
          listaArtefato = removerArtefatoDeletado(listaArtefato)
        }

        const listaArtefatoComTarefaMesmoTipo = filtrarArtefatoComTarefaMesmoTipo(listaArtefato)
        const listaArtefatoSemTarefaMesmoTipo = filtrarArtefatoSemTarefaMesmoTipo(listaArtefato)

        const listaFoo = obterFoo(listaArtefatoComTarefaMesmoTipo)
        const listaBar = obterBar(listaArtefatoSemTarefaMesmoTipo)

        return listaFoo.concat(listaBar)

      } catch (error) {
        throw new Error(error.message)
      }
    }
  }

  function obterBar(listaArtefatoSemTarefaMesmoTipo) {

    const listaBar = []

    gerador.listaTarefaComSaida.forEach(tarefaParam => {

      let foo = new Foo()

      foo.listaNumTarefa.push(tarefaParam)

      listaArtefatoSemTarefaMesmoTipo.forEach(artefato => {

        artefato.listaTarefa.forEach(function (tarefa) {

          if (tarefaParam === tarefa.numTarefa) {

            let artefatoFoo = {
              nomeArtefato: artefato.nomeArtefato,
              tipoAlteracao: tarefa.tipoAlteracao,
              numeroAlteracao: tarefa.numeroAlteracao
            }

            foo.listaArtefatoFoo.push(artefatoFoo);
          }
        })
      })

      listaBar.push(foo)
    })

    return listaBar
  }

  function obterFoo(listaArtefatoComTarefaMesmoTipo) {

    return listaArtefatoComTarefaMesmoTipo.map(function (artefato) {

      let foo = new Foo()
      let totalModificacao = 0
      let tipoAlteracao = ''

      foo.listaNumTarefa = artefato.listaTarefa.map(
        function (tarefa) {

          totalModificacao += tarefa.numeroAlteracao
          tipoAlteracao = tarefa.tipoAlteracao

          return tarefa.numTarefa
        })

      let artefatoFoo = {
        nomeArtefato: artefato.nomeArtefato,
        tipoAlteracao: tipoAlteracao,
        numeroAlteracao: totalModificacao
      }

      foo.listaArtefatoFoo.push(artefatoFoo)

      return foo
    })
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

    listaArtefato.forEach(artefato => {

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
              undefined, listaTarefaMesmoTipo))
        }
      }
    })

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
            new Artefato(artefato.nomeArtefato,
              artefato.nomeProjeto, listaTarefaUnicoTipoAlteracao))
        }
      }
    })

    return listaArtefatoUmTipoModificacao
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
          gerador.listaTarefaComSaida.add(task)
          listaComandoExecutado.push(new Comando(retorno.stdout, nomeProjeto, task, comando))
        }
      }
    }

    return listaComandoExecutado
  }

  return gerador
}