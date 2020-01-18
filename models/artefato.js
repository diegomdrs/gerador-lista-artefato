const Artefato = function ({
    nomeArtefato,
    nomeNovoArtefato,
    nomeAntigoArtefato,
    nomeProjeto,
    listaTarefa,
    tipoAlteracao,
    numeroAlteracao,
}) {
    this.nomeArtefato = nomeArtefato
    this.nomeNovoArtefato = nomeNovoArtefato
    this.nomeAntigoArtefato = nomeAntigoArtefato
    this.nomeProjeto = nomeProjeto
    this.listaTarefa = listaTarefa
    this.tipoAlteracao = tipoAlteracao
    this.numeroAlteracao = numeroAlteracao

    this.getNomeArtefatoReverso = () =>
        this.nomeArtefato.split('').reverse().join('')

    return this
}

module.exports = Artefato