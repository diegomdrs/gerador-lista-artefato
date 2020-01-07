
const Commit = require('../models/commit')

class Arquivo {
    constructor(nomeProjeto, numeroTarefa, linhaArquivo) {

        this.nomeProjeto = nomeProjeto

        this.nomeArquivo = linhaArquivo.match(/\s.+/g)[0].match(/\w.+/g)[0]
        this.nomeArquivo = this.nomeArquivo.match(/^[^\s]*/g)[0]
            .replace(/^/g, this.nomeProjeto + '/')

        this.commit = new Commit(this, numeroTarefa, linhaArquivo)
    }
}

module.exports = Arquivo