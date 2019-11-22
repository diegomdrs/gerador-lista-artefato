const util = require('util');
const path = require('path');

const exec = util.promisify(require('child_process').exec);
const args = process.argv.slice(2)

init()

function init() {

  const params = obterParametros();

  if (params.projeto && params.autor && params.task && params.diretorio) {

    const listaPromiseExecucaoComando = obterLista(params.task).reduce(function (prev, task) {

      obterLista(params.projeto).forEach(function (projeto) {
        prev.push(executarComandoGitLog(params.diretorio, projeto, params.autor, task))
      });

      return prev
    }, [])

    Promise.all(listaPromiseExecucaoComando).then(function (listaComandoExecutado) {

      const listaAgrupadaPorTask = obterListaAgrupadaPorTask(listaComandoExecutado)

      imprimirListaTask(listaAgrupadaPorTask)

    }).catch(function ({ cmd, stderr }) {
      console.log(cmd + '\n' + stderr)
    })
  }
}

function imprimirListaTask(lista) {

  lista.forEach(function (task) {

    console.log("\nTarefa nº " + task.task)

    task.listaProjeto.forEach(function (projeto) {

      console.log('\n')

      projeto.listaArtefato.forEach(function ({ tipoAlteracao, numeroAlteracao, nomeArtefato }) {
        console.log(tipoAlteracao + '\t' + numeroAlteracao + '\t' + nomeArtefato);
      })
    })
  });
}

function obterListaAgrupadaPorTask(listaComandoExecutado) {

  const listaComandoExecutadoComStdout = listaComandoExecutado.filter(function (comandoExecutado) {
    return comandoExecutado.stdout
  })

  return agruparListaComandoPorTask(listaComandoExecutadoComStdout)
    .map(function (comandoExecutado) {

    let listaProjeto = comandoExecutado.listaProjeto.map(function (projeto) {

      let listaArtefatoProjeto = obterListaArtefato(projeto.nomeProjeto, projeto.stdout);

      listaArtefatoProjeto = removerArtefatoDeletado(listaArtefatoProjeto);
      listaArtefatoProjeto.sort(ordenarLista)

      return {
        nomeProjeto: projeto.nomeProjeto,
        listaArtefato: listaArtefatoProjeto
      }
    })

    return {
      task: comandoExecutado.task,
      listaProjeto: listaProjeto
    }
  }).filter(function (item) {
    return item.listaProjeto.length
  })
}

function agruparListaComandoPorTask(listaComandoExecutado) {

  return listaComandoExecutado.reduce(function (prev, item) {

    const taskAgrupadora = item.task;
    const itemProjeto = { nomeProjeto: item.projeto, stdout: item.stdout }

    let comandoExecutado = {
      task: taskAgrupadora,
      listaProjeto: [itemProjeto]
    }

    if (prev.length === 0) {

      prev = [comandoExecutado]

    } else {

      const taskEncontrada = prev.find(function (itemLista) {
        return itemLista.task === taskAgrupadora
      });

      if (taskEncontrada) {

        const projetoEncontrado = taskEncontrada.listaProjeto.find(function (projetoLista) {
          return projetoLista.nomeProjeto === item.projeto
        });

        if (projetoEncontrado) {
          projetoEncontrado.stdout = projetoEncontrado.stdout.concat('\n' + item.stdout)

        } else {
          taskEncontrada.listaProjeto.push(itemProjeto)
        }
      } else {

        prev.push(comandoExecutado)
      }
    }

    return prev
  }, []);
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

  return reverterNomeArtefato(artefatoA.nomeArtefato).localeCompare(
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

function obterListaArtefato(projeto, stdout) {

  const listaArtefatosSaidaComando = stdout.match(/^([A-Z]{1}|R\d+)\s.*$/gm)
  let listaSaida = []

  if (listaArtefatosSaidaComando && listaArtefatosSaidaComando.length) {

    listaArtefatosSaidaComando.forEach(function (artefatoSaida) {

      const diretorioProjeto = path.basename(projeto)
      const tipoAlteracao = artefatoSaida.match(/^\w{1}/g)[0]
      const artefato = artefatoSaida.match(/\s.+/g)[0].match(/\w.+/g)[0]

      const caminhoArtefato = artefato
        .replace(/^/g, diretorioProjeto + '/')
        .replace(/\s+/g, ' ' + diretorioProjeto + '/')

      let artefatoModificacaoEncontrado = listaSaida.find(function (objSaida) {
        return objSaida.nomeArtefato === caminhoArtefato && objSaida.tipoAlteracao === 'M';
      })

      if (tipoAlteracao === 'A' || !artefatoModificacaoEncontrado) {

        listaSaida.push({
          tipoAlteracao: tipoAlteracao,
          nomeArtefato: caminhoArtefato,
          numeroAlteracao: 1
        })
      } else {

        artefatoModificacaoEncontrado.numeroAlteracao += 1;
      }
    })
  }

  return listaSaida
}

function obterLista(param) {

  if (!Array.isArray(param)) {
    return param.split()
  }

  return param
}

function obterParametros() {

  let obj = {}

  args.forEach(function (arg) {

    const key = arg.split('=')[0].replace(/[^\w]/g, '')
    let value = arg.split('=')[1]

    if (value.match(/\w+,\w+/g)) {
      value = value.split(',')
    }

    obj[key] = value;
  });

  return obj
}