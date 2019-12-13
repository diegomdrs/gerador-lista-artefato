class Param {

    constructor(args) {
      args.forEach((arg) => this['_' + this.getKey(arg)] = this.getValue(arg)
      )
    }
  
    get autor() { return this._autor }
    get task() { return this.getList(this._task) }
    get projeto() { return this.getList(this._projeto) }
    get diretorio() { return this._diretorio }
    get mostrarDeletados() { return this._mostrarDeletados }
    get mostrarNumModificacao() { return this._mostrarNumModificacao }
    get server() { return this._server }

    getList(param) {
      return (!Array.isArray(param)) ? param.split() : param
    }
  
    getKey(arg) {
      return arg.split('=')[0].replace(/--+/g, '')
        .replace(/-([a-z])/g, g => g[1].toUpperCase())
    }
  
    getValue(arg) {
  
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