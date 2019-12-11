class Artefato {
    constructor(nomeArtefato, nomeProjeto, listaTarefa) {
        this.nomeArtefato = nomeArtefato,
        this.nomeProjeto = nomeProjeto,
        this.listaTarefa = listaTarefa
    }

    getNomeArtefatoReverso() {
        return this.nomeArtefato.split('').reverse().join('')
    }
}

module.exports = Artefato