const util = require('util')
const path = require('path')
const exec = util.promisify(require('child_process').exec)

const Tarefa = require('../models/tarefa')
const Artefato = require('../models/artefato')
const SaidaVO = require('../models/saida-vo')

module.exports = function (params) {

  let gerador = {}

  gerador.gerarListaArtefato = async function () {

    try {
      const listaPromiseComando = await obterListaPromiseComando()
      const listaArtefato = await executarListaPromiseComando(listaPromiseComando)
      let listaTarefaAgrupadaPorArtefato = obterListaTarefaAgrupadaPorArtefato(listaArtefato)

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

  function obterListaTarefaAgrupadaPorArtefato(lista) {

    return lista.reduce(function (accum, artefatoCru) {

      const tarefaBruta = new Tarefa(artefatoCru.numTarefa, artefatoCru.tipoAlteracao)
      const artefatoBruto = new Artefato(artefatoCru.nomeArtefato,
        artefatoCru.nomeProjeto, [tarefaBruta])

      if (accum.length === 0) {

        accum = [artefatoBruto]

      } else if (accum.length > 0) {

        let artefatoEncontrado = accum.find(artefato =>
          artefato.nomeArtefato === artefatoCru.nomeArtefato)

        if (artefatoEncontrado) {

          let taskModificacaoEncontrada = artefatoEncontrado.listaTarefa.find(tarefa =>
            tarefa.numTarefa === tarefaBruta.numTarefa && tarefa.isTipoAlteracaoModificacao()
          )

          if (taskModificacaoEncontrada && tarefaBruta.isTipoAlteracaoModificacao()) {
            taskModificacaoEncontrada.numeroAlteracao += 1
          } else {
            artefatoEncontrado.listaTarefa.push(tarefaBruta)
          }
        } else {
          accum.push(artefatoBruto)
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

  async function obterListaPromiseComando() {

    let listaPromiseComando = []

    for (const nomeProjeto of params.projeto) {

      const caminhoProjeto = path.join(params.diretorio, nomeProjeto)

      let comando = 'git -C ' + caminhoProjeto + ' log --regexp-ignore-case --no-merges --author=' +
        params.autor + ' --all --name-status --pretty=format:\'%s\' -C'

      for (const task of params.task) {
        comando = comando.concat(' --grep=' + task)
      }

      listaPromiseComando.push(exec(comando))
    }

    return listaPromiseComando
  }

  async function executarListaPromiseComando(listaPromiseComando) {

    let listaArtefato = []

    await Promise.all(listaPromiseComando).then(function (listaRetorno) {

      for (const index in listaRetorno) {

        const lista = obterListaArtefato(listaRetorno[index].stdout, params.projeto[index])

        listaArtefato.push.apply(listaArtefato, lista)
      }
    })

    return listaArtefato
  }

  function obterListaArtefato(retorno, nomeProjeto) {

    const listaRetorno = retorno.split(/\n{2,}/g)

    return listaRetorno.map(function (f) {

      const arquivoArtefato = f.match(/[^\r\n]+/g)[1].match(/\s.+/g)[0].match(/\w.+/g)[0]

      const nomeArtefato = arquivoArtefato
        .replace(/^/g, nomeProjeto + '/')
        .replace(/\s+/g, ' ' + nomeProjeto + '/')

      return {
        numTarefa: f.match(/[^\r\n]+/g)[0].match(/\d+/)[0],
        tipoAlteracao: f.match(/[^\r\n]+/g)[1].match(/^\w{1}/g)[0],
        nomeArtefato: nomeArtefato,
        nomeProjeto: nomeProjeto
      }
    })
  }

  return gerador
}