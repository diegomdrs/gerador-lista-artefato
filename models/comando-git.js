const Comando = (caminhoProjeto, autor, listaTask, mostrarCommitsLocais) => {

    let comando = `git -C ${caminhoProjeto} log --reverse --regexp-ignore-case --no-merges --author=${autor}`

    if (!mostrarCommitsLocais)
        comando = comando.concat(' --branches')
    else
        comando = comando.concat(' --remotes')

    comando = comando.concat(
        ' --name-status --pretty=format:\'%s\' -C')

    for (const task of listaTask)
        comando = comando.concat(` --grep=${task}`)

    return comando
}

module.exports = Comando