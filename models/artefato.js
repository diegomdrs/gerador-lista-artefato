const Artefato = function ({
    nomeArtefato,
    nomeNovoArtefato,
    nomeAntigoArtefato,
    extensao,
    tipoArtefato,
    nomeProjeto,
    listaTarefa,
    tipoAlteracao,
    numeroAlteracao,
}) {
    this.nomeArtefato = nomeArtefato
    this.nomeNovoArtefato = nomeNovoArtefato
    this.nomeAntigoArtefato = nomeAntigoArtefato
    this.extensao = extensao
    this.tipoArtefato = tipoArtefato
    this.nomeProjeto = nomeProjeto
    this.listaTarefa = listaTarefa
    this.tipoAlteracao = tipoAlteracao
    this.numeroAlteracao = numeroAlteracao

    this.obterNomeArtefatoReverso = () =>
        this.nomeArtefato.split('').reverse().join('')

    return this
}

module.exports = Artefato