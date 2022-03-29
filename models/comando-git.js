const { TAMANHO_HASH_COMMIT } = require('../lib/constants')

const Comando = (caminhoProjeto, autor, listaTask, mostrarCommitsLocais, dataInicio, dataFim) => {

    let comando = 'git'

    // Equivale ao comando 'git config --global core.abbrev 10', mas funcionando somente para o comando atual
    comando = comando.concat(` -c core.abbrev=${TAMANHO_HASH_COMMIT}`)

    comando = comando.concat(` -C ${caminhoProjeto} log --reverse --regexp-ignore-case --no-merges --author=${autor}`)
    comando = mostrarCommitsLocais
        ? comando.concat(' --branches')
        : comando.concat(' --remotes')

    // Instead of showing the full 40-byte hexadecimal commit object name, show a prefix that names the object uniquely
    // Equivale ao comando 'git config --global log.abbrevcommit yes', mas funcionando somente para o comando atual
    comando = comando.concat(' --abbrev-commit')

    // %H - commit hash
    // %h - abbreviated commit hash
    // %s - subject
    comando = comando.concat(
        ' --name-status --pretty=format:"%h %s" -C')

    for (const task of listaTask)
        comando = comando.concat(` --grep=${task}`)

    if (dataInicio && dataFim) {
        comando = comando.concat(` --after="${dataInicio}" --before="${dataFim}"`)
    }

    return comando
}

module.exports = Comando