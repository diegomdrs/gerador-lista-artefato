
const Commit = require('../models/commit')

class Arquivo {
    constructor(nomeProjeto, retorno) {

        this.nomeProjeto = nomeProjeto

        this.nomeArquivo = retorno.match(/[^\r\n]+/g)[1].match(/\s.+/g)[0].match(/\w.+/g)[0]
        this.nomeArquivo = this.nomeArquivo.match(/^[^\s]*/g)[0]
            .replace(/^/g, this.nomeProjeto + '/')

        this.commit = new Commit(this, retorno)
    }
}

module.exports = Arquivo