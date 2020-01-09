class Param {

  constructor(body) {
    this.autor = this.getAttrRequired('autor', body.autor)
    this.task = this.getAttrRequired('task', Param.getList(body.task))
    this.projeto = this.getAttrRequired('projeto', Param.getList(body.projeto))
    this.mostrarDeletados = body.mostrarDeletados,
    this.mostrarRenomeados = body.mostrarRenomeados,
    this.mostrarNumModificacao = body.mostrarNumModificacao
    this.mostrarCommitsLocais = body.mostrarCommitsLocais
  }

  getAttrRequired(paramName, attr) {
    if (!attr) {
      throw new Error('Paramêtro não encontrado: ' + paramName)
    }
    return attr
  }

  static getList(param) {
    return (!Array.isArray(param)) ? param.split() : param
  }
}

module.exports = Param