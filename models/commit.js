const Commit = function (arquivo, numeroTarefa, linhaArquivo) {

    this.numeroTarefa = numeroTarefa
    this.tipoAlteracao = linhaArquivo.match(/^\w{1}/g)[0]

    this.isTipoAlteracaoModificacao = () => this.tipoAlteracao === 'M'
    this.isTipoAlteracaoDelecao = () => this.tipoAlteracao === 'D'
    this.isTipoAlteracaoRenomear = () => this.tipoAlteracao === 'R'

    if (this.isTipoAlteracaoRenomear()) {

        this.nomeAntigoArquivo = arquivo.nomeArquivo
        this.nomeNovoArquivo = linhaArquivo.match(/[^\s]*.[^\r]$/g)[0]
            .replace(/^/g, arquivo.nomeProjeto + '/').trim()
    }

    return this
}

module.exports = Commit