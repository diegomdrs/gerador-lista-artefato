class Param {

  constructor(body) {
    this.autor = this.getAttrRequired('autor', body.autor)
    this.task = this.getAttrRequired('task', Param.getList(body.task))
    this.projeto = this.getAttrRequired('projeto', Param.getList(body.projeto))
    this.diretorio = this.getAttrRequired('diretorio', body.diretorio)
    this.mostrarDeletados = body.mostrarDeletados
    this.mostrarNumModificacao = body.mostrarNumModificacao
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