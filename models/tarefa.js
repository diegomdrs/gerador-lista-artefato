const TIPO_MODIFICACAO = require('../lib/constants').TIPO_MODIFICACAO
class Tarefa {
    constructor(numeroTarefa, tipoAlteracao) {
        this.numeroTarefa = numeroTarefa,
        this.tipoAlteracao = tipoAlteracao,
        this.numeroAlteracao = 1
    }

    isTipoAlteracaoModificacao() { return this.tipoAlteracao === TIPO_MODIFICACAO.MODIFIED }
    isTipoAlteracaoDelecao() { return this.tipoAlteracao === TIPO_MODIFICACAO.DELETED }
    isTipoAlteracaoRenomear() { return this.tipoAlteracao === TIPO_MODIFICACAO.RENAMED }
}

module.exports = Tarefa