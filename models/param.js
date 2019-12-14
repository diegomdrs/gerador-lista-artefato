class Param {

  constructor() { }

  static getFromBody(body) {

    let param = new Param()

    param._server = body.server
    param._autor = body.autor
    param._task = Param.getList(body.task)
    param._projeto = Param.getList(body.projeto)
    param._diretorio = body.diretorio
    param._mostrarDeletados = body.mostrarDeletados
    param._mostrarNumModificacao = body.mostrarNumModificacao

    return param
  }

  static getFromArgs(args) {

    let param = new Param()

    args.forEach((arg) => param['_' + this.getKey(arg)] = this.getValue(arg))

    return param
  }

  getAttr(paramName, attr) {
    if (!attr) {
      throw new Error('Paramêtro não encontrado: ' + paramName)
    }
    return attr
  }

  get autor() { return this._autor }
  get task() { return Param.getList(this._task) }
  get projeto() { return Param.getList(this._projeto) }
  get diretorio() { return this._diretorio }
  get mostrarDeletados() { return this._mostrarDeletados }
  get mostrarNumModificacao() { return this._mostrarNumModificacao }
  get server() { return this._server }

  static getList(param) {
    return (!Array.isArray(param)) ? param.split() : param
  }

  static getKey(arg) {
    return arg.split('=')[0].replace(/--+/g, '')
      .replace(/-([a-z])/g, g => g[1].toUpperCase())
  }

  static getValue(arg) {

    let value = arg.split('=')[1]

    if (value) {
      if (value.match(/\w+,\w+/g)) {
        value = value.split(',')
      }
    } else {
      value = true
    }

    return value
  }
}

module.exports = Param