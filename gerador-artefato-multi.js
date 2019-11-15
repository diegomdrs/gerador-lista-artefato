const util = require('util');
const exec = util.promisify(require('child_process').exec);
const args = process.argv.slice(2)

var listaPromise = []

// ex. Linux:   node gerador-artefato-multi.js --projeto=/kdi/git/apc-api,/kdi/git/apc-estatico,/kdi/git/crm-patrimonio-estatico --autor=c1282036 --task=1194196,1189666
// ex. Windows: TODO

// node gerador-artefato-multi.js --projeto=/home/jon/Documents/comando-qas/foo-estatico,/home/jon/Documents/comando-qas/foo-api --autor=c1282036 --task=1194196

init()

function init() {

  let params = obterParametros();

  if (params.projeto && params.autor && params.task) {

    params.task.forEach(function (task) {

      params.projeto.forEach(function (projeto) {
        listaPromise.push(executarComandoGitLog(projeto, params.autor, task))
      });
    })

    Promise.all(listaPromise).then(function (listaSaidaComando) {

      let objAgrupadoPorTask = groupBy('task', listaSaidaComando)

      Object.keys(objAgrupadoPorTask).forEach(function(key){

        console.log('\nTarefa nº ' + key + '\n')

        const listaSaidaByTask = objAgrupadoPorTask[key]

        console.log(listaSaidaByTask)

        listaSaidaByTask.forEach(function(foo){

          const lista = obterLista(foo.stdout,foo.task,foo.projeto);

          // lista = removerDeletados(lista);
          lista.sort(ordenarLista)

          // imprimirLista(lista)
        });
      })


    }).catch(function(erro){

      console.log(erro.cmd)
      console.log(erro.stderr)
    })

    // let cars = [
    //   { brand: 'Audi', color: 'black' },
    //   { brand: 'Audi', color: 'white' },
    //   { brand: 'Ferarri', color: 'red' },
    //   { brand: 'Ford', color: 'white' },
    //   { brand: 'Peugot', color: 'white' }
    // ];

    // console.log(groupBy('brand', cars))
  }
}

function groupBy(key, lista) {

  return lista.reduce(function (objectsByKeyValue, obj) {
    const value = obj[key];
    objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
    return objectsByKeyValue;
  }, {});
}

function removerDeletados(listaArtefato) {

  return listaArtefato.filter(function (artefatoFilter) {

    // console.log('artefatoFilter: ' + artefatoFilter.artefato)

    let possuiArtefatoCorrespondenteDeletado = listaArtefato.some(function (artefatoSome) {
      return (artefatoFilter.artefato === artefatoSome.artefato) && artefatoSome.tipoAlteracao === 'D'
    })

    return artefatoFilter.tipoAlteracao !== 'D' && !possuiArtefatoCorrespondenteDeletado
  })
}

function ordenarLista(artefatoA, artefatoB) {
  return artefatoA.artefato > artefatoB.artefato
}

function imprimirLista(lista) {

  lista.forEach(function (item) {

    console.log(item.tipoAlteracao + '\t' +
      item.numeroAlteracao + '\t' +
      item.artefato);
  });
}

async function executarComandoGitLog(projeto, autor, task) {

  let comando = 'git -C ' + projeto + ' log --no-merges --author=' + autor +
    ' --all --name-status --grep=' + task;

  // console.log(comando + '\n')

  var retorno = await exec(comando);
  retorno.projeto = projeto;
  retorno.task = task
  retorno.comando = comando;

  return retorno
}

function obterLista(saidaComando, task, projeto) {

  // console.log('saidaComando: ' + saidaComando)
  // console.log('task: ' + task)
  // console.log('projeto: ' + projeto)

  let listaArtefatosSaidaComando = saidaComando.match(/^((M|D|A){1}|R.*)\s.*$/gm)
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
          task: task,
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

    let key = arg.split('=')[0].replace(/[^\w]/g, '')
    let value = arg.split('=')[1].split(',')

    obj[key] = value;
  });

  return obj
}
