const path = require('path')
const fs = require('fs-extra')

module.exports = (listaDiretorio) => {

  return {

    listarDiretorio: async () => {

      listaDiretorio = Array.from(new Set(listaDiretorio))

      let listaRetorno = []
      const listaPromiseDiretorio = await obterListaPromiseDiretorio()

      await Promise.all(listaPromiseDiretorio).then(listaRetornoPromise => {

        listaRetorno = listaRetornoPromise.reduce((accum, lista) => {
          accum.push.apply(accum, lista)
          return accum
        }, [])
      })

      return Array.from(new Set(listaRetorno))
    }
  }

  function obterListaPromiseDiretorio() {

    return listaDiretorio.map(diretorio => {
      return listarDiretorio(diretorio)
    })
  }

  async function listarDiretorio(caminho) {

    return new Promise(function (resolve, reject) {

      try {

        const lista = []

        if (isDiretorioAcessivel(caminho))
          listarDiretorioRecursivo(caminho, lista)

        resolve(lista)

      } catch (error) {
        reject(error)
      }
    })
  }

  function listarDiretorioRecursivo(diretorio, lista) {

    const listaSubDiretorio = fs.readdirSync(diretorio).filter(subDiretorio => {

      const caminhoSubDiretorio = path.join(diretorio, subDiretorio)

      return isDiretorioAcessivel(caminhoSubDiretorio)
    })

    return listaSubDiretorio.map(subDiretorio => {

      const caminho = path.join(diretorio, subDiretorio)

      if (subDiretorio === '.git')
        lista.push(diretorio)
      else
        listarDiretorioRecursivo(caminho, lista)
    })
  }

  function isDiretorioAcessivel(caminho) {

    try {

      if (fs.existsSync(caminho) && fs.lstatSync(caminho).isDirectory()) {
        fs.accessSync(caminho, fs.constants.F_OK | fs.constants.R_OK)

        return true
      }

      throw new Error('Diretório inacessivel')

    } catch (error) {

      return false
    }
  }
}