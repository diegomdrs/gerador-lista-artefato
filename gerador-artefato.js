const util = require('util');
const path = require('path');

const exec = util.promisify(require('child_process').exec);
const args = process.argv.slice(2)

// node gerador-artefato.js --diretorio=/kdi/git --projeto=crm-patrimonio-api,crm-patrimonio-estatico,apc-api,apc-estatico --autor=c1282036 --task=1194196,1189666,1186823,1181009,1179615,1176490,1186251
// gerador-artefato.sh -d /kdi/git -p 'crm-patrimonio-api,crm-patrimonio-estatico,apc-api,apc-estatico' -u c1282036 -t 1194196,1189666,1186823,1181009,1179615,1176490,1186251

init()

function init() {

  const params = obterParametros();

  if (params.projeto && params.autor && params.task && params.diretorio) {

    const listaPromiseExecucaoComando = []

    obterLista(params.task).forEach(function (task) {

      obterLista(params.projeto).forEach(function (projeto) {

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

  const listaComandoExecutadoComStdout = listaComandoExecutado.filter(function (comandoExecutado) {
    return comandoExecutado.stdout
  })

  return agruparListaComandoPorTask(listaComandoExecutadoComStdout)
    .map(function (comandoExecutado) {

      let listaArtefato = []

      comandoExecutado.listaProjeto.forEach(function (projeto) {

        let listaArtefatoProjeto = obterListaArtefato(projeto.nomeProjeto, projeto.stdout);

        listaArtefatoProjeto = removerArtefatoDeletado(listaArtefatoProjeto);
        listaArtefatoProjeto.sort(ordenarLista)

        listaArtefato.push.apply(listaArtefato, listaArtefatoProjeto)
      })

      return {
        task: comandoExecutado.task,
        listaArtefato: listaArtefato
      }
    })
    .filter(function (item) {
      return item.listaArtefato.length
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

      return (artefatoFilter.artefato === artefatoSome.artefato)
        && artefatoSome.tipoAlteracao === 'D'
    })

    return artefatoFilter.tipoAlteracao !== 'D' && !possuiArtefatoCorrespondenteDeletado
  })
}

function ordenarLista(artefatoA, artefatoB) {
  return artefatoA.artefato > artefatoB.artefato
}

async function executarComandoGitLog(projeto, autor, task) {

  let comando = 'git -C ' + projeto + ' log --no-merges --author=' + autor +
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
        return objSaida.artefato === caminhoArtefato && objSaida.tipoAlteracao === 'M';
      })

      if (tipoAlteracao === 'A' || !artefatoModificacaoEncontrado) {

        listaSaida.push({
          tipoAlteracao: tipoAlteracao,
          artefato: caminhoArtefato,
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