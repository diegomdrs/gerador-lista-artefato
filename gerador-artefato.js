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

      var lista = obterLista(saidaComando.stdout, params.task, params.diretorio);
      
      if (lista) {
        
        lista = removerDeletados(lista);

        lista.sort(ordenarLista)

        // imprimirLista(lista)
      }
    })
  }
}

function removerDeletados(listaArtefato) {

  return listaArtefato.filter(function (artefatoFilter) {
  
    let condicaoA = artefatoFilter.tipoAlteracao !== 'D' && listaArtefato.some(function(artefatoSome){
      return (artefatoFilter.artefato === artefatoSome.artefato) && artefatoSome.tipoAlteracao === 'D'
    }) 

    console.log('artefatoFilter: ' + artefatoFilter.tipoAlteracao + ' condicao: ' + condicaoA)
    
    return condicaoA
  })
}

function ordenarLista(artefatoA, artefatoB) {
  return artefatoA.artefato > artefatoB.artefato
}

function imprimirLista(lista) {
  lista.forEach(function (item) {
    console.log(item.tipoAlteracao + '\t' + item.artefato);
  });
}

async function executarComandoGitLog(diretorio, autor, task) {
  return await exec('git -C ' + diretorio +
    ' log --no-merges --author=' + autor +
    ' --all --name-status -C --grep=' + task + '');
}

function obterLista(saidaComando, task, diretorio) {

  let listaArtefatosSaidaComando = saidaComando.match(/^((M|D|A){1}|R.*)\s.*$/gm)

  if (listaArtefatosSaidaComando && listaArtefatosSaidaComando.length) {

    // A lista é ordenada para os commits com 'A' (Added) aparecerem primeiro na lista
    // listaArtefatosSaidaComando.sort(function(a, b){ return a > b })

    return listaArtefatosSaidaComando.map(function (artefatoSaida) {

      let tipoAlteracao = artefatoSaida.match(/^(M|D|A|R)/g)[0]
      let diretorioProjeto = diretorio.match(/[^/|\\]*$/g)[0]
      let artefato = diretorioProjeto + '/' + artefatoSaida.match(/[^\s+]\w.*/g)[0]

      return {
        tipoAlteracao: tipoAlteracao,
        artefato: artefato,
        task: task
      }
    })
  }
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
