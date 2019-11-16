const util = require('util');
const path = require('path');

const exec = util.promisify(require('child_process').exec);
const args = process.argv.slice(2)

// ex. Linux:   node gerador-artefato-multi.js --projeto=/kdi/git/apc-api,/kdi/git/apc-estatico,/kdi/git/crm-patrimonio-estatico --autor=c1282036 --task=1194196,1189666
// ex. Windows: TODO

// node gerador-artefato-multi.js --diretorio=/home/jon/Documents/comando-qas --projeto=foo-estatico,foo-api --autor=c1282036 --task=1194196,1189666
// ./gerador-artefato.sh -d /home/jon/Documents/comando-qas -p 'foo' -u c1282036 -t '1194196,1189666'

// 1194196
// git -C /home/jon/Documents/comando-qas/foo-api log --no-merges --author=c1282036 --all --name-status --grep=1194196
// git -C /home/jon/Documents/comando-qas/foo-estatico log --no-merges --author=c1282036 --all --name-status --grep=1194196

// 1189666
// git -C /home/jon/Documents/comando-qas/foo-api log --no-merges --author=c1282036 --all --name-status --grep=1189666 
// git -C /home/jon/Documents/comando-qas/foo-estatico log --no-merges --author=c1282036 --all --name-status --grep=1189666

// TODO
// Testar com uma task que nao existe

init()

function init() {

  const params = obterParametros();

  if (params.projeto && params.autor && params.task && params.diretorio) {

    const listaPromiseExecucaoComando = []

    params.task.forEach(function (task) {

      params.projeto.forEach(function (projeto) {

        const caminhoProjeto = path.join(params.diretorio, projeto)

        listaPromiseExecucaoComando.push(executarComandoGitLog(caminhoProjeto, params.autor, task))
      });
    })

    Promise.all(listaPromiseExecucaoComando).then(function (listaComandoExecutado) {

      const listaAgrupadaPorTask = obterListaAgrupadaPorTask(listaComandoExecutado)

      imprimirListaAgrupadaPorTask(listaAgrupadaPorTask)

    }).catch(function (erro) {
      console.log(erro.cmd)
      console.log(erro.stderr)
    })
  }
}

function imprimirListaAgrupadaPorTask(lista) {

  lista.forEach(function (item) {

    console.log("\nTarefa nº " + item.task + '\n')

    item.listaArtefato.forEach(function (artefato) {

      console.log(artefato.tipoAlteracao + '\t' +
        artefato.numeroAlteracao + '\t' +
        artefato.artefato);
    })
  });
}

function obterListaAgrupadaPorTask(listaComandoExecutado) {

  const listaComandoAgrupadoPorTask = agruparListaComandoPorTask(listaComandoExecutado)

  return listaComandoAgrupadoPorTask.map(function (comandoExecutado) {

    let listaArtefato = []

    comandoExecutado.listaProjeto.forEach(function (projeto) {

      let listaArtefatoProjeto = obterListaArtefato(projeto.nomeProjeto, projeto.stdout);

      listaArtefatoProjeto = removerDeletados(listaArtefatoProjeto);
      listaArtefatoProjeto.sort(ordenarLista)

      listaArtefato.push.apply(listaArtefato, listaArtefatoProjeto)
    })

    return {
      task: comandoExecutado.task,
      listaArtefato: listaArtefato
    }
  })
}

function agruparListaComandoPorTask(listaComandoExecutado) {

  return listaComandoExecutado.reduce(function (prev, item) {

    const taskAgrupadora = item.task;
    const isListaTaskVazia = prev.length === 0
    const itemProjeto = { nomeProjeto: item.projeto, stdout: item.stdout }

    let comandoExecutado = {
      task: taskAgrupadora,
      listaProjeto: [itemProjeto]
    }

    if (isListaTaskVazia) {

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
      } else if (!taskEncontrada) {

        prev.push(comandoExecutado)
      }
    }

    return prev
  }, []);
}

function removerDeletados(listaArtefato) {

  var retorno = listaArtefato.filter(function (artefatoFilter) {

    let possuiArtefatoCorrespondenteDeletado = listaArtefato.some(function (artefatoSome) {

      return (artefatoFilter.artefato === artefatoSome.artefato) && artefatoSome.tipoAlteracao === 'D'
    })

    return artefatoFilter.tipoAlteracao !== 'D' && !possuiArtefatoCorrespondenteDeletado
  })

  return retorno
}

function ordenarLista(artefatoA, artefatoB) {
  return artefatoA.artefato > artefatoB.artefato
}

async function executarComandoGitLog(projeto, autor, task) {

  let comando = 'git -C ' + projeto + ' log --no-merges --author=' + autor +
    ' --all --name-status --grep=' + task;

  var retorno = await exec(comando);
  retorno.projeto = projeto;
  retorno.task = task
  retorno.comando = comando;

  return retorno
}

function obterListaArtefato(projeto, stdout) {

  let listaArtefatosSaidaComando = stdout.match(/^((M|D|A){1}|R.*)\s.*$/gm)
  let listaSaida = []

  if (listaArtefatosSaidaComando && listaArtefatosSaidaComando.length) {

    listaArtefatosSaidaComando.forEach(function (artefatoSaida) {

      let tipoAlteracao = artefatoSaida.match(/^(M|D|A|R)/g)[0]
      let diretorioProjeto = projeto.match(/[^/|\\]*$/g)[0]
      let artefato = diretorioProjeto + '/' + artefatoSaida.match(/[^\s+]\w.*/g)[0]

      let artefatoModificaoEncontrado = listaSaida.find(function (objSaida) {
        return objSaida.artefato === artefato && objSaida.tipoAlteracao === 'M';
      })

      if (tipoAlteracao === 'A' || !artefatoModificaoEncontrado) {

        listaSaida.push({
          tipoAlteracao: tipoAlteracao,
          artefato: artefato,
          numeroAlteracao: 1
        })
      } else {

        artefatoModificaoEncontrado.numeroAlteracao += 1;
      }
    })
  }

  return listaSaida
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