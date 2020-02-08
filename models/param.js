const Param = function ({
  autor,
  listaTarefa,
  listaProjeto,
  mostrarDeletados,
  mostrarRenomeados,
  mostrarCommitsLocais,
  mostrarNumModificacao
}) {
  this.autor = getAttrRequired('autor', autor)
  this.listaTarefa = getAttrRequired('task', getList(listaTarefa))
  this.listaProjeto = getAttrRequired('projeto', getList(listaProjeto))
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