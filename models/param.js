const Param = function ({
  autor,
  task,
  projeto,
  mostrarDeletados,
  mostrarRenomeados,
  mostrarCommitsLocais,
  mostrarNumModificacao
}) {
  this.autor = getAttrRequired('autor', autor)
  this.task = getAttrRequired('task', getList(task))
  this.projeto = getAttrRequired('projeto', getList(projeto))
  this.mostrarDeletados = mostrarDeletados
  this.mostrarRenomeados = mostrarRenomeados
  this.mostrarCommitsLocais = mostrarCommitsLocais
  this.mostrarNumModificacao = mostrarNumModificacao
}

function getList(param) {
  const lista = !Array.isArray(param) ? param.split() : param

  return Array.from(new Set(lista))
}

function getAttrRequired(paramName, attr) {
  if (!attr) {
    throw new Error(`Paramêtro não encontrado: ${paramName}`)
  }
  return attr
}

module.exports = Param