
const program = require('commander')
const package = require('../package.json')

program
    .description('Comando para listar os artefatos incluídos/alterados/renomeados para geração do QAS')
    .option('-s, --server', 'inicia a versão server e ignora os outros parâmetros')
    .option('-d, --diretorio <type>', 'diretório raiz dos projetos Git')
    .option('-p, --projeto <type>', 'lista de projetos Git (podem ser passados vários projetos separados por vírgula)', commaSeparatedList)
    .option('-a, --autor <type>', 'matrícula do autor dos commits')
    .option('-t, --task <type>', 'lista de tarefas (podem ser passadas várias tarefas separadas por vírgula)', commaSeparatedList)
    .option('--mostrar-num-modificacao', 'nº de modificações do artefato na tarefa ou tarefas')
    .option('--mostrar-deletados', 'mostrar artefatos deletados na tarefa')
    .version(package.version, '-v, --version', 'mostra a versão do programa')

function commaSeparatedList(value, dummyPrevious) {
    return value.split(',');
}

program.parse(process.argv)

module.exports = program