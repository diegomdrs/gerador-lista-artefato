class ComandoGit {
    
    constructor(caminhoProjeto, autor, listaTask) {
        this.caminhoProjeto = caminhoProjeto
        this.autor = autor
        this.comando = 'git -C ' + this.caminhoProjeto +
            ' log --reverse --regexp-ignore-case --no-merges --author=' +
            this.autor + ' --remotes --name-status --pretty=format:\'%s\' -C'

        for (const task of listaTask) {
            this.comando = this.comando.concat(' --grep=' + task)
        }
    }
}

module.exports = ComandoGit