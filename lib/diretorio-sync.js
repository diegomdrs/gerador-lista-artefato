const path = require('path')
const fs = require('fs-extra')

module.exports = (listaDiretorio) => {

  return {

    listarDiretorio: async () => {

      let listaRetorno = []

      listaDiretorio.forEach(diretorio => {

        const lista = listarDiretorio(diretorio)

        listaRetorno.push.apply(listaRetorno, lista)
      })

      return listaRetorno
    }
  }

  function listarDiretorio(caminho) {

    const lista = []

    if (fs.lstatSync(caminho).isDirectory()) {
      listarDiretorioRecursivo(caminho, lista)
    }

    return lista
  }

  function listarDiretorioRecursivo(diretorio, lista) {

    const listaSubDiretorio = fs.readdirSync(diretorio).filter(subDiretorio => {

      const caminhoSubDiretorio = path.join(diretorio, subDiretorio)

      return fs.lstatSync(caminhoSubDiretorio).isDirectory() &&
        isDiretorioAcessivel(caminhoSubDiretorio)
    })

    return listaSubDiretorio.map(subDiretorio => {

      const caminho = path.join(diretorio, subDiretorio)

      if (subDiretorio === '.git')
        lista.push(diretorio)
      else
        listarDiretorioRecursivo(caminho, lista)
    })
  }

  function isDiretorioAcessivel(caminhoSubDiretorio) {

    try {
      fs.accessSync(caminhoSubDiretorio, fs.constants.F_OK | fs.constants.R_OK)
      return true
    } catch (error) {
      return false
    }
  }
}