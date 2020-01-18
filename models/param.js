const Param = function (body) {

  this.autor = getAttrRequired('autor', body.autor)
  this.task = getAttrRequired('task', getList(body.task))
  this.projeto = getAttrRequired('projeto', getList(body.projeto))
  this.mostrarDeletados = body.mostrarDeletados
  this.mostrarRenomeados = body.mostrarRenomeados
  this.mostrarNumModificacao = body.mostrarNumModificacao
}

function getList(param) {
  return (!Array.isArray(param)) ? param.split() : param
}

function getAttrRequired(paramName, attr) {
  if (!attr) {
    throw new Error('Paramêtro não encontrado: ' + paramName)
  }
  return attr
}

module.exports = Param