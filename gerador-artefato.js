const util = require('util');
const exec = util.promisify(require('child_process').exec);
const args = process.argv.slice(2)

init()

function init() {

  let params = obterParametros();

  if (params.diretorio && params.autor && params.task) {

    executarComandoGitLog(params.diretorio, params.autor, params.task).then(function (saidaComando) {
    
      var lista = obterLista(saidaComando.stdout, params.task);

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

function obterLista(saidaComando, task) {

  // Regex que seleciona cada commit, autor, data e os artefatos
  // let listaSaida = saida.match(/(commit).*\n(Author).*\n(Date).*\n[\s\S]*?(?=\n.*?((commit).*\n(Author).*\n(Date).*\n))/g)

  let listaArtefatosSaidaComando = saidaComando.match(/^((M|D|A){1}|R.*)\s.*$/gm)

  // A lista é ordenada para os commits com 'A' (Added) aparecerem primeiro na lista
  listaArtefatosSaidaComando.sort()

  if(listaArtefatosSaidaComando && listaArtefatosSaidaComando.length){

    let listaSaida = []

    listaArtefatosSaidaComando.forEach(function (artefato) {
      
      let obj = {
        tipoAlteracao: artefato.match(/^(M|D|A|R)/g)[0],
        artefato: artefato.match(/[^\s+]\w.*/g)[0],
        task: task,
        numeroAlteracao: 1
      };
  
      let objEncontrado = listaSaida.find(function(objSaida){
        return objSaida.artefato === obj.artefato;
      })
  
      if(objEncontrado) {
  
        objEncontrado.numeroAlteracao += 1;
      } else {
  
        listaSaida.push(obj)
      }
    })
  
    return listaSaida
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
