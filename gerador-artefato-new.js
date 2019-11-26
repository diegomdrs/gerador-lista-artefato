const util = require('util');
const path = require('path');

const exec = util.promisify(require('child_process').exec);
const args = process.argv.slice(2)
const params = obterParametros();

init()

function init() {

  if (params.projeto && params.autor && params.task && params.diretorio) {

    const listaPromiseExecucaoComando = obterListaPromise()

    Promise.all(listaPromiseExecucaoComando).then(function (listaComandoExecutado) {

      const listaComandoComStout = filtrarComandosComSaida(listaComandoExecutado)
      const listaArtefato = obterListaTarefaAgrupadaPorArtefato(listaComandoComStout)

      imprimirListaArtefato(listaArtefato)

    }).catch(function ({ cmd, stderr }) {
      console.log(cmd + '\n' + stderr)
    })
  }
}

function imprimirListaArtefato(listaArtefato) {

  console.log('')

  if (!params.mostrarDeletados) {
    listaArtefato = removerArtefatoDeletado(listaArtefato)
  }

  const listaArtefatoDuasModificacoes = listarArtefatoDuasModificacoes(listaArtefato)
  const listaArtefatoUmaModificacao = listarArtefatoUmTipoModificacao(listaArtefato)

  imprimirListaArtefatoDuasModificacoes(listaArtefatoDuasModificacoes)
  imprimirListaArtefatoUmaModificacao(listaArtefatoUmaModificacao)
}

function imprimirListaArtefatoDuasModificacoes(lista) {
  lista.forEach(function (artefato) {

    const tarefas = artefato.listaTarefa.reduce(function (accum, tarefa) {
      accum.listaTarefa.push(tarefa.numTarefa)
      accum.totalModificacao += tarefa.numeroAlteracao

      return accum
    }, { totalModificacao: 0, listaTarefa: [] })

    console.log('Tarefas nº ' + tarefas.listaTarefa.join(', ') + '\n')
    console.log('M\t' +
      (params.mostrarNumModificacao ? tarefas.totalModificacao + '\t' : '') +
      artefato.nomeArtefato + '\n')
  })
}

function imprimirListaArtefatoUmaModificacao(listaArtefatoUmaModificacao) {

  params.task.forEach(function (tarefaParam) {

    console.log('Tarefa nº ' + tarefaParam + '\n')

    listaArtefatoUmaModificacao.forEach(function (artefato, index) {

      if(artefato.listaTarefa.length) {

        const artefatoAnterior = listaArtefatoUmaModificacao[index - 1]

        if (artefatoAnterior &&
          artefatoAnterior.nomeProjeto !== artefato.nomeProjeto) {
  
          console.log('-----------------------')
        }
      }

      artefato.listaTarefa.forEach(function (tarefa) {

        if (tarefa.numTarefa === tarefaParam) {

          console.log(tarefa.tipoAlteracao + '\t' +
            (params.mostrarNumModificacao ? tarefa.numeroAlteracao + '\t' : '') +
            artefato.nomeArtefato)
        }
      })
    })

    console.log('')
  })
}

function listarArtefatoDuasModificacoes(listaArtefato) {

  let listaArtefatoDuasModificacoes = []

  listaArtefato.forEach(function (artefato) {

    if (artefato.listaTarefa.length > 1) {

      const listaTarefaMesmoTipo = artefato.listaTarefa
        .filter(function (tarefaAtual, indexAtual) {

          const listaSemTarefaAtual = artefato.listaTarefa
            .filter(function (tarefaFilter, index) {
              return index !== indexAtual
            })

          const retorno = listaSemTarefaAtual.some(function (tarefaSome) {
            return tarefaAtual.tipoAlteracao === tarefaSome.tipoAlteracao
          })

          return retorno
        })

      if (listaTarefaMesmoTipo.length) {

        listaArtefatoDuasModificacoes.push({
          nomeArtefato: artefato.nomeArtefato,
          listaTarefa: listaTarefaMesmoTipo
        })
      }
    }
  })

  return listaArtefatoDuasModificacoes
}


function listarArtefatoUmTipoModificacao(listaArtefato) {

  let listaArtefatoAteUmTipo = []

  listaArtefato.forEach(function (artefato) {

    if (artefato.listaTarefa.length === 1) {

      listaArtefatoAteUmTipo.push(artefato)

    } else if (artefato.listaTarefa.length > 1) {

      const listaTarefaUnicoTipoAlteracao = artefato.listaTarefa
        .filter(function (tarefaAtual, indexAtual) {

          const listaSemTarefaAtual = artefato.listaTarefa
            .filter(function (tarefaFilter, index) {
              return index !== indexAtual
            })

          const retorno = listaSemTarefaAtual.some(function (tarefaSome) {
            return tarefaAtual.tipoAlteracao === tarefaSome.tipoAlteracao
          })

          return !retorno
        })

      listaArtefatoAteUmTipo.push({
        nomeArtefato: artefato.nomeArtefato,
        nomeProjeto: artefato.nomeProjeto,
        listaTarefa: listaTarefaUnicoTipoAlteracao
      })
    }
  })

  return listaArtefatoAteUmTipo
}

function obterListaTarefaAgrupadaPorArtefato(listaComandoExecutado) {

  const listaTaskProjeto = listarProjetoPorTask(listaComandoExecutado)

  return listaTaskProjeto.reduce(function (accum, projeto) {

    let listaArtefatoProjetoTask = obterListaArtefatoTask(projeto);

    if (accum.length === 0) {

      accum.push.apply(accum, listaArtefatoProjetoTask)

    } else if (accum.length > 0) {

      listaArtefatoProjetoTask.forEach(function (artefatoNovo) {

        let artefatoEncontrado = accum
          .find(function (artefatoaccum) {
            return artefatoaccum.nomeArtefato === artefatoNovo.nomeArtefato
          })

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

function listarProjetoPorTask(listaComandoExecutado) {

  return listaComandoExecutado.map(function (item) {

    const itemProjeto = {
      task: item.task,
      nomeProjeto: item.projeto,
      stdout: item.stdout
    }

    return itemProjeto
  })
}

function removerArtefatoDeletado(listaArtefato) {
  return listaArtefato.filter(function (artefato) {
    return !artefato.listaTarefa.some(function (tarefa) {
      return tarefa.tipoAlteracao === 'D'
    })
  })
}

function ordenarListaArtefato(artefatoA, artefatoB) {
  return artefatoA.nomeProjeto.localeCompare(artefatoB.nomeProjeto) ||
    reverterNomeArtefato(artefatoA.nomeArtefato).localeCompare(
      reverterNomeArtefato(artefatoB.nomeArtefato))
}

function reverterNomeArtefato(nomeArtefato) {
  return nomeArtefato.split('').reverse().join('')
}

async function executarComandoGitLog(diretorio, projeto, autor, task) {

  const caminhoProjeto = path.join(diretorio, projeto)

  let comando = 'git -C ' + caminhoProjeto + ' log --regexp-ignore-case --no-merges --author=' + autor +
    ' --all --name-status -C --grep=' + task;

  var retorno = await exec(comando);
  retorno.projeto = projeto;
  retorno.task = task
  retorno.comando = comando;

  return retorno
}

function obterListaArtefatoTask({ task, nomeProjeto, stdout }) {

  const listaArtefatosSaidaComando = stdout.match(/^([A-Z]{1}|R\d+)\s.*$/gm)

  if (listaArtefatosSaidaComando && listaArtefatosSaidaComando.length) {

    return listaArtefatosSaidaComando.reduce(function (accum, artefatoSaida) {

      const tipoAlteracao = artefatoSaida.match(/^\w{1}/g)[0]
      const diretorioProjeto = path.basename(nomeProjeto)
      const arquivoArtefato = artefatoSaida.match(/\s.+/g)[0].match(/\w.+/g)[0]

      const nomeArtefato = arquivoArtefato
        .replace(/^/g, diretorioProjeto + '/')
        .replace(/\s+/g, ' ' + diretorioProjeto + '/')

      const tarefa = {
        numTarefa: task,
        tipoAlteracao: tipoAlteracao,
        numeroAlteracao: 1
      }

      const artefato = {
        nomeArtefato: nomeArtefato,
        nomeProjeto: nomeProjeto,
        listaTarefa: [tarefa]
      }

      if (accum.length === 0) {

        accum = [artefato]

      } else if (accum.length > 0) {

        let artefatoEncontrado = accum.find(function (artefato) {
          return artefato.nomeArtefato === nomeArtefato
        })

        if (artefatoEncontrado) {

          let taskModificacaoEncontrada = artefatoEncontrado.listaTarefa.find(function (tarefa) {
            return tarefa.numTarefa === task && tarefa.tipoAlteracao === 'M'
          })

          if (taskModificacaoEncontrada && tipoAlteracao === 'M') {
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

function obterLista(param) {

  if (!Array.isArray(param)) {
    return param.split()
  }

  return param
}

function obterListaPromise() {
  return obterLista(params.task).reduce(function (accum, task) {

    obterLista(params.projeto).forEach(function (projeto) {
      accum.push(executarComandoGitLog(params.diretorio, projeto, params.autor, task))
    });

    return accum
  }, [])
}

function filtrarComandosComSaida(listaComandoExecutado) {
  return listaComandoExecutado.filter(function (comandoExecutado) {
    return comandoExecutado.stdout
  })
}

function obterParametros() {

  return args.reduce(function (accum, arg) {

    const key = obterKey(arg)
    const value = obterValue(arg)

    accum[key] = value;

    return accum
  }, {});
}

function obterKey(arg) {

  return arg.split('=')[0].replace(/--+/g, '')
    .replace(/-([a-z])/g, function (g) {
      return g[1].toUpperCase();
    })
}

function obterValue(arg) {

  let value = arg.split('=')[1]

  if (value) {
    if (value.match(/\w+,\w+/g)) {
      value = value.split(',')
    }
  } else {
    value = true
  }

  return value
}
