class Artefato {
    constructor(nomeArtefato, nomeNovoArtefato, 
            nomeAntigoArtefato, nomeProjeto, listaTarefa) {
                
        this.nomeNovoArtefato = nomeNovoArtefato,
        this.nomeAntigoArtefato = nomeAntigoArtefato,
        this.nomeArtefato = nomeArtefato,
        this.nomeProjeto = nomeProjeto,
        this.listaTarefa = listaTarefa
    }

    getNomeArtefatoReverso() {
        return this.nomeArtefato.split('').reverse().join('')
    }
}

module.exports = Artefato