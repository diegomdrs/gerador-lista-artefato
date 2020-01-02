class Commit {
    constructor(arquivo, retorno) {

        this.tipoAlteracao = retorno.match(/[^\r\n]+/g)[1].match(/^\w{1}/g)[0]
        this.numTarefa = retorno.match(/[^\r\n]+/g)[0].match(/\d+/)[0]

        if (this.isTipoAlteracaoRenomear()) {

            this.nomeAntigoArquivo = arquivo.nomeArquivo
            this.nomeNovoArquivo = retorno.match(/[^\s]*.[^\r]$/g)[0]
                .replace(/^/g, arquivo.nomeProjeto + '/')
        }
    }

    isTipoAlteracaoModificacao() { return this.tipoAlteracao === 'M' }
    isTipoAlteracaoDelecao() { return this.tipoAlteracao === 'D' }
    isTipoAlteracaoRenomear() { return this.tipoAlteracao === 'R' }
}

module.exports = Commit