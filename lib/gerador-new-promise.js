const util = require('util')
const path = require('path')
const exec = util.promisify(require('child_process').exec)
const fs = require('fs-extra')

const Tarefa = require('../models/tarefa')
const Artefato = require('../models/artefato')
const SaidaVO = require('../models/saida-vo')

module.exports = function (params) {

  let gerador = {}

  gerador.gerarListaArtefato = async function () {

    try {
      const listaPromiseComando = await obterListaPromiseComando()
      let listaArtefato = await executarListaPromiseComando(listaPromiseComando)

      tratarArtefatoRenomeado(listaArtefato)

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
              undefined, undefined, undefined,
              listaTarefaMesmoTipo))
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

  function obterListaTarefaAgrupadaPorArtefato(lista) {

    return lista.reduce(function (accum, artefatoCru) {

      const tarefaBruta = new Tarefa(
        artefatoCru.numTarefa,
        artefatoCru.tipoAlteracao)

      const artefatoBruto = new Artefato(
        artefatoCru.nomeArtefato,
        artefatoCru.nomeNovoArtefato,
        artefatoCru.nomeAntigoArtefato,
        artefatoCru.nomeProjeto,
        [tarefaBruta])

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

    for (const caminhoProjeto of params.projeto) {

      if (fs.existsSync(caminhoProjeto)) {

        let comando = 'git -C ' + caminhoProjeto + ' log --regexp-ignore-case --no-merges --author=' +
          params.autor + ' --all --name-status --pretty=format:\'%s\' -C'

        for (const task of params.task) {
          comando = comando.concat(' --grep=' + task)
        }

        listaPromiseComando.push(exec(comando))
      } else {

        throw new Error('Projeto \'' + caminhoProjeto + '\' não encontrado')
      }
    }

    return listaPromiseComando
  }

  async function executarListaPromiseComando(listaPromiseComando) {

    let listaArtefato = []

    await Promise.all(listaPromiseComando).then(function (listaRetorno) {

      for (const index in listaRetorno) {

        if(listaRetorno[index].stdout) {

          const nomeProjeto = path.basename(params.projeto[index])
          const lista = obterListaArtefato(listaRetorno[index].stdout, nomeProjeto)
  
          listaArtefato.push.apply(listaArtefato, lista)
        }
      }
    })

    return listaArtefato
  }

  function obterListaArtefato(retorno, nomeProjeto) {

    const listaRetorno = retorno.split(/\n{2,}/g)

    return listaRetorno.map(function (f) {

      const arquivoArtefato = f.match(/[^\r\n]+/g)[1].match(/\s.+/g)[0].match(/\w.+/g)[0]
      const tipoAlteracao = f.match(/[^\r\n]+/g)[1].match(/^\w{1}/g)[0]
      const numTarefa = f.match(/[^\r\n]+/g)[0].match(/\d+/)[0]

      let nomeArtefato = arquivoArtefato.match(/^[^\s]*/g)[0]
        .replace(/^/g, nomeProjeto + '/')
      let nomeNovoArtefato, nomeAntigoArtefato

      if (tipoAlteracao === 'R') {
        nomeAntigoArtefato = nomeArtefato
        nomeNovoArtefato = arquivoArtefato.match(/[^\s]*.$/g)[0]
          .replace(/^/g, nomeProjeto + '/')
      }

      return {
        numTarefa: numTarefa,
        tipoAlteracao: tipoAlteracao,

        nomeArtefato: nomeArtefato,
        nomeAntigoArtefato: nomeAntigoArtefato,
        nomeNovoArtefato: nomeNovoArtefato,

        nomeProjeto: nomeProjeto
      }
    })
  }

  function tratarArtefatoRenomeado(listaArtefato) {

    let listaArtefatoTipoRenomeado = listaArtefato.filter(
      artetafoFilter => artetafoFilter.tipoAlteracao === 'R')

    for (const artefatoRenomeado of listaArtefatoTipoRenomeado) {

      const foo = listaArtefato
        .filter(artefato =>
          artefato.nomeArtefato === artefatoRenomeado.nomeArtefato)

        foo.forEach(artefato =>
          artefato.nomeArtefato = artefatoRenomeado.nomeNovoArtefato)
    }
  }

  return gerador
}