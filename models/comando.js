class Comando {
    constructor(stdout, projeto, task, comando) {
        this.stdout = stdout
        this.nomeProjeto = projeto
        this.task = task
        this.comando = comando
    }
}

module.exports = Comando