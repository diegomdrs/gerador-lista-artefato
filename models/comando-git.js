const Comando = (caminhoProjeto, autor, listaTask, mostrarCommitsLocais, dataInicio, dataFim) => {

    let comando = `git -C ${caminhoProjeto} log --reverse --regexp-ignore-case --no-merges --author=${autor}`

    comando = mostrarCommitsLocais
        ? comando.concat(' --branches')
        : comando.concat(' --remotes')

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