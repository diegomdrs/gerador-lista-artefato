class ComandoGit {

    constructor(caminhoProjeto, autor, listaTask, mostrarCommitsLocais) {
        this.caminhoProjeto = caminhoProjeto
        this.autor = autor

        this.comando = 'git -C ' + this.caminhoProjeto +
            ' log --reverse --regexp-ignore-case --no-merges --author=' +
            this.autor

        if (mostrarCommitsLocais)
            this.comando = this.comando.concat(' --branches')
        else
            this.comando = this.comando.concat(' --remotes')

        this.comando = this.comando.concat(
            ' --name-status --pretty=format:\'%s\' -C')

        for (const task of listaTask) {
            this.comando = this.comando.concat(' --grep=' + task)
        }
    }
}

module.exports = ComandoGit