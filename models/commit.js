class Commit {
    constructor(arquivo, numTarefa, linhaArquivo) {

        this.numTarefa = numTarefa
        this.tipoAlteracao = linhaArquivo.match(/^\w{1}/g)[0]

        if (this.isTipoAlteracaoRenomear()) {

            this.nomeAntigoArquivo = arquivo.nomeArquivo
            this.nomeNovoArquivo = linhaArquivo.match(/[^\s]*.[^\r]$/g)[0]
                .replace(/^/g, arquivo.nomeProjeto + '/').trim()
        }
    }

    isTipoAlteracaoModificacao() { return this.tipoAlteracao === 'M' }
    isTipoAlteracaoDelecao() { return this.tipoAlteracao === 'D' }
    isTipoAlteracaoRenomear() { return this.tipoAlteracao === 'R' }
}

module.exports = Commit