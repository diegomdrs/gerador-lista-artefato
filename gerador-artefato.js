const util = require('util');
const exec = util.promisify(require('child_process').exec);
const args = process.argv.slice(2)

var params = {}
var saida = ''

init()

function init() {

  obterParametros()

  if (params['diretorio'] && params['author'] && params['task']) {

    gitLog().then(function () {

      var listaSaida = saida.match(/(commit).*\n(Author).*\n(Date).*\n{2}\s+(task).*\n{2}(M|D|A|R.*).*/g)

      var listaObjetos = listaSaida.map(function (foo) {

        var obj = {}

        obj.commit = foo.split('\n')[0].trim();
        obj.author = foo.split('\n')[1]
        obj.date = foo.split('\n')[2]

        return obj;
      })

      console.log(listaSaida);
    })
  }
}

async function gitLog() {
  const { stdout, stderr } = await exec('git -C ' + params['diretorio'] + ' log --no-merges --author=' + params['author'] + ' --all --name-status -C --grep=' + params['task'] + '');
  saida = stdout;
}

function obterParametros() {
  args.forEach(function (arg) {

    key = arg.split('=')[0]
    value = arg.split('=')[1]

    params[key] = value;
  });
}
