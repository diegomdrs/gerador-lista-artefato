const Artefato = function (nomeArtefato, nomeNovoArtefato,
    nomeAntigoArtefato, nomeProjeto, listaTarefa) {

    this.nomeNovoArtefato = nomeNovoArtefato
    this.nomeAntigoArtefato = nomeAntigoArtefato
    this.nomeArtefato = nomeArtefato
    this.nomeProjeto = nomeProjeto
    this.listaTarefa = listaTarefa

    this.getNomeArtefatoReverso = () =>
        this.nomeArtefato.split('').reverse().join('')

    return this
}

module.exports = Artefato