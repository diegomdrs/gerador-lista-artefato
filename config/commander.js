
const program = require('commander')

program
    .option('--server', 'foo')
    .option('--diretorio <type>', 'foo')
    .option('--projeto <type>', 'foo')
    .option('--autor <type>', 'foo')
    .option('--task <type>', 'foo')
    .option('--mostrar-num-modificacao', 'foo')
    .option('--mostrar-deletados', 'foo')

program.parse(process.argv)

module.exports = program