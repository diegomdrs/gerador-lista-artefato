
const program = require('commander')
const package = require('../package.json')

program
    .description('Comando para listar os artefatos incluídos/alterados/renomeados para geração do QAS')
    .option('-s, --server', 'inicia a versão server')
    .option('-d, --diretorio <type>', 'foo')
    .option('-p, --projeto <type>', 'foo', commaSeparatedList)
    .option('-a, --autor <type>', 'foo')
    .option('-t, --task <type>', 'foo', commaSeparatedList)
    .option('--mostrar-num-modificacao', 'foo')
    .option('--mostrar-deletados', 'foo')
    .version(package.version, '-v, --version', 'mostra a versão do programa')

function commaSeparatedList(value, dummyPrevious) {
    return value.split(',');
}

program.parse(process.argv)

module.exports = program