const util = require('util');
const path = require('path');

const exec = util.promisify(require('child_process').exec);
const args = process.argv.slice(2)
const params = obterParametros();

init()

function init() {

  if (params.projeto && params.autor && params.task && params.diretorio) {

    const listaPromiseExecucaoComando = obterLista(params.task).reduce(function (prev, task) {

      obterLista(params.projeto).forEach(function (projeto) {
        prev.push(executarComandoGitLog(params.diretorio, projeto, params.autor, task))
      });

      return prev
    }, [])

    Promise.all(listaPromiseExecucaoComando).then(function (listaComandoExecutado) {

      const listaComandoComStout = filtrarComandosComSaida(listaComandoExecutado)
      const listaAgrupadaPorTask = obterListaAgrupadaPorTask(listaComandoComStout)

      // imprimirListaTask(listaAgrupadaPorTask)

    }).catch(function ({ cmd, stderr }) {
      console.log(cmd + '\n' + stderr)
    })
  }
}

function imprimirListaTask(lista) {

  lista.forEach(function ({ task, listaProjeto }) {

    console.log("\nTarefa nº " + task)

    listaProjeto.forEach(function (projeto) {

      console.log('')

      projeto.listaArtefato.forEach(
        function ({ tipoAlteracao, numeroAlteracao, nomeArtefato }) {

          console.log(tipoAlteracao + '\t' +
            (params.mostrarnummodificacao ? (numeroAlteracao + '\t') : '') +
            nomeArtefato);
        })
    })
  });
}

function obterListaAgrupadaPorTask(listaComandoExecutado) {

  const listaTaskProjeto = listarProjetoPorTask(listaComandoExecutado)

  return listaTaskProjeto.map(function (projeto) {

    let listaArtefatoProjetoTask = obterListaArtefato(projeto);

    console.table(listaArtefatoProjetoTask)
  })
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

  return listaArtefato.filter(function (artefatoFilter) {

    let possuiArtefatoCorrespondenteDeletado = listaArtefato.some(function (artefatoSome) {

      return (artefatoFilter.nomeArtefato === artefatoSome.nomeArtefato)
        && artefatoSome.tipoAlteracao === 'D'
    })

    return artefatoFilter.tipoAlteracao !== 'D' && !possuiArtefatoCorrespondenteDeletado
  })
}

function ordenarLista(artefatoA, artefatoB) {

  return artefatoA.tipoAlteracao.localeCompare(artefatoB.tipoAlteracao) ||
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

function obterListaArtefato({ task, nomeProjeto, stdout }) {

  const listaArtefatosSaidaComando = stdout.match(/^([A-Z]{1}|R\d+)\s.*$/gm)

  if (listaArtefatosSaidaComando && listaArtefatosSaidaComando.length) {

    return listaArtefatosSaidaComando.reduce(function (prev, artefatoSaida) {

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
        listaTarefa: [tarefa]
      }

      if (prev.length > 0) {

        let artefatoEncontrado = prev.find(function (artefato) {
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
          prev.push(artefato)
        }

      } else {
        prev = [artefato]
      }

      return prev
    }, [])
  }
}

function obterLista(param) {

  if (!Array.isArray(param)) {
    return param.split()
  }

  return param
}

function filtrarComandosComSaida(listaComandoExecutado) {
  return listaComandoExecutado.filter(function (comandoExecutado) {
    return comandoExecutado.stdout
  })
}

function obterParametros() {

  let obj = {}

  args.forEach(function (arg) {

    const key = arg.split('=')[0].replace(/[^\w]/g, '')
    let value = arg.split('=')[1]

    if (value) {
      if (value.match(/\w+,\w+/g)) {
        value = value.split(',')
      }
    } else {
      value = true
    }

    obj[key] = value;
  });

  return obj
}