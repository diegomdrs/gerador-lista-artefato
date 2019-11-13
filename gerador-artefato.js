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

  lista.forEach(function(item){
      console.log(item.tipoAlteracao + '\t' + item.artefato);
  });
}

async function gitLog() {
  return await exec('git -C ' + params['diretorio'] + ' log --no-merges --author=' + params['author'] + ' --all --name-status -C --grep=' + params['task'] + '');
}

function obterLista(listaSaidaComando) {

  // Regex que seleciona cada commit, autor, data e os artefatos
  // let listaSaida = saida.match(/(commit).*\n(Author).*\n(Date).*\n[\s\S]*?(?=\n.*?((commit).*\n(Author).*\n(Date).*\n))/g)

  let listaSaida = listaSaidaComando.match(/^((M|D|A){1}|R.*)\s.*$/gm)

  return listaSaida.map(function (artefato) {
    return {
      tipoAlteracao: artefato.match(/^(M|D|A|R)/g)[0],
      artefato: artefato.match(/[^\s+]\w.*/g)[0],
      task: params['task']
    };
  })
}

function obterParametros() {
  args.forEach(function (arg) {

    key = arg.split('=')[0]
    value = arg.split('=')[1]

    params[key] = value;
  });
}
