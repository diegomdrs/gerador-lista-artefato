const util = require('util');
const exec = util.promisify(require('child_process').exec);
const args = process.argv.slice(2)

init()

function init() {

  let params = obterParametros();

  if (params.diretorio && params.autor && params.task) {

    executarComandoGitLog(params.diretorio, params.autor, params.task).then(function (saidaComando) {
    
      var lista = obterLista(saidaComando.stdout, params.task, params.diretorio);

      imprimirLista(lista)
    })
  }
}

function imprimirLista(lista) {

  if(lista) {
      lista.forEach(function (item) {
        console.log(item.tipoAlteracao + '\t' + item.numeroAlteracao + '\t' + item.artefato);
      });
  }
}

async function executarComandoGitLog(diretorio, autor, task) {
  return await exec('git -C ' + diretorio + 
    ' log --no-merges --author=' + autor + 
      ' --all --name-status -C --grep=' + task + '');
}

function obterLista(saidaComando, task, diretorio) {

  let listaArtefatosSaidaComando = saidaComando.match(/^((M|D|A){1}|R.*)\s.*$/gm)

  // A lista é ordenada para os commits com 'A' (Added) aparecerem primeiro na lista
  listaArtefatosSaidaComando.sort()

  if(listaArtefatosSaidaComando && listaArtefatosSaidaComando.length){

    let listaArtefato = []

    listaArtefatosSaidaComando.forEach(function (artefatoSaida) {
      
      let tipoAlteracao = artefatoSaida.match(/^(M|D|A|R)/g)[0]
      let diretorioProjeto = diretorio.match(/[^/|\\]*$/g)[0]
      let artefato = diretorioProjeto + '/' + artefatoSaida.match(/[^\s+]\w.*/g)[0]

      let artefatoEncontrado = listaArtefato.find(function(objSaida){
        return objSaida.artefato === artefato;
      })
  
      if(artefatoEncontrado) {
        artefatoEncontrado.numeroAlteracao += 1;
      } else {
        listaArtefato.push({
          tipoAlteracao: tipoAlteracao,
          artefato: artefato,
          task: task,
          numeroAlteracao: 1
        })
      }
    })
  
    return listaArtefato
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
