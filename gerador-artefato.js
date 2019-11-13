const util = require('util');
const exec = util.promisify(require('child_process').exec);
const args = process.argv.slice(2)

var params = {}

init()

function init() {

  obterParametros()

  if (params['diretorio'] && params['author'] && params['task']) {

    gitLog().then(function (saidaComando) {

      var lista = obterLista(saidaComando.stdout);

      imprimirLista(lista)
    })
  }
}

function imprimirLista(lista) {

  lista.forEach(function (item) {
    console.log(item.tipoAlteracao + '\t' + item.numeroAlteracao + '\t' + item.artefato);
  });
}

async function gitLog() {
  return await exec('git -C ' + params['diretorio'] + ' log --no-merges --author=' + params['author'] + ' --all --name-status -C --grep=' + params['task'] + '');
}

function obterLista(saidaComando) {

  // Regex que seleciona cada commit, autor, data e os artefatos
  // let listaSaida = saida.match(/(commit).*\n(Author).*\n(Date).*\n[\s\S]*?(?=\n.*?((commit).*\n(Author).*\n(Date).*\n))/g)

  let listaArtefatosSaidaComando = saidaComando.match(/^((M|D|A){1}|R.*)\s.*$/gm)

  let listaSaida = []

  listaArtefatosSaidaComando.forEach(function (artefato) {
    
    let obj = {
      tipoAlteracao: artefato.match(/^(M|D|A|R)/g)[0],
      artefato: artefato.match(/[^\s+]\w.*/g)[0],
      task: params['task'],
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

function obterParametros() {
  args.forEach(function (arg) {

    key = arg.split('=')[0]
    value = arg.split('=')[1]

    params[key] = value;
  });
}
