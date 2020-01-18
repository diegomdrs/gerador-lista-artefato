const TIPO_MODIFICACAO = require('../lib/constants').TIPO_MODIFICACAO

const Commit = function (arquivo, numeroTarefa, linhaArquivo) {

    this.numeroTarefa = numeroTarefa
    this.tipoAlteracao = linhaArquivo.match(/^\w{1}/g)[0]

    this.isTipoAlteracaoModificacao = () => this.tipoAlteracao === TIPO_MODIFICACAO.MODIFIED
    this.isTipoAlteracaoDelecao = () => this.tipoAlteracao === TIPO_MODIFICACAO.DELETED
    this.isTipoAlteracaoRenomear = () => this.tipoAlteracao === TIPO_MODIFICACAO.RENAMED

    if (this.isTipoAlteracaoRenomear()) {

        this.nomeAntigoArquivo = arquivo.nomeArquivo
        this.nomeNovoArquivo = linhaArquivo.match(/[^\s]*.[^\r]$/g)[0]
            .replace(/^/g, arquivo.nomeProjeto + '/').trim()
    }

    return this
}

module.exports = Commit