const util = require('util');
const exec = util.promisify(require('child_process').exec);
const args = process.argv.slice(2)

// ex. Linux: node gerador-artefato.js diretorio=/kdi/git/crm-patrimonio-estatico autor=c1282036 task=1194436
// ex. Windows: node gerador-artefato.js diretorio=C:\kdi\git\crm-patrimonio-estatico autor=c1299072 task=1194436

init()

function init() {

  let params = obterParametros();

  if (params.diretorio && params.autor && params.task) {

    executarComandoGitLog(params.diretorio, params.autor, params.task).then(function (saidaComando) {

      let lista = obterLista(saidaComando.stdout, params.task, params.diretorio);

      if (lista) {

        lista = removerDeletados(lista);

        lista.sort(ordenarLista)

        imprimirLista(lista)
      }
    })
  }
}

function removerDeletados(listaArtefato) {

  return listaArtefato.filter(function (artefatoFilter) {

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
    console.log(item.tipoAlteracao + '\t' + item.numeroAlteracao + '\t' + item.artefato);
  });
}

async function executarComandoGitLog(diretorio, autor, task) {
  return await exec('git -C ' + diretorio +
    ' log --no-merges --author=' + autor +
    ' --all --name-status -C --grep=' + task + '');
}

function obterLista(saidaComando, task, diretorio) {

  let listaArtefatosSaidaComando = saidaComando.match(/^((M|D|A){1}|R.*)\s.*$/gm)
  let listaSaida = []

  if (listaArtefatosSaidaComando && listaArtefatosSaidaComando.length) {

    listaArtefatosSaidaComando.forEach(function (artefatoSaida) {

      let tipoAlteracao = artefatoSaida.match(/^(M|D|A|R)/g)[0]
      let diretorioProjeto = diretorio.match(/[^/|\\]*$/g)[0]
      let artefato = diretorioProjeto + '/' + artefatoSaida.match(/[^\s+]\w.*/g)[0]

      let objEncontrado = listaSaida.find(function(objSaida){
        return objSaida.artefato === artefato && objSaida.tipoAlteracao === 'M';
      })

      if(objEncontrado) {
  
        objEncontrado.numeroAlteracao += 1;
      } else {
  
        listaSaida.push({
          tipoAlteracao: tipoAlteracao,
          artefato: artefato,
          task: task,
          numeroAlteracao: 1
        })
      }
    })
  }

  return listaSaida
}

function obterParametros() {

  let obj = {}

  args.forEach(function (arg) {

    let key = arg.split('=')[0]
    let value = arg.split('=')[1]

    obj[key] = value;
  });

  return obj
}
