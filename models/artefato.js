const Artefato = function ({
    nomeArtefato,
    nomeNovoArtefato,
    nomeAntigoArtefato,
    extensao,
    nomeProjeto,
    listaTarefa,
    tipoAlteracao,
    numeroAlteracao,
}) {
    this.nomeArtefato = nomeArtefato
    this.nomeNovoArtefato = nomeNovoArtefato
    this.nomeAntigoArtefato = nomeAntigoArtefato
    this.extensao = extensao
    this.nomeProjeto = nomeProjeto
    this.listaTarefa = listaTarefa
    this.tipoAlteracao = tipoAlteracao
    this.numeroAlteracao = numeroAlteracao

    this.obterNomeArtefatoReverso = () =>
        this.nomeArtefato.split('').reverse().join('')

    return this
}

module.exports = Artefato