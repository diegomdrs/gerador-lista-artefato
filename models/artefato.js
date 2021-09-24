const Artefato = function ({
    nomeArtefato,
    extensao,
    tipoArtefato,
    nomeProjeto,
    listaTarefa,
    tipoAlteracao,
    numeroAlteracao,
}) {
    this.nomeArtefato = nomeArtefato
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