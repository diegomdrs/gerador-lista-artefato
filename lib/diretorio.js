const util = require('util')
const path = require('path')
const exec = util.promisify(require('child_process').exec)
const fs = require('fs-extra')

const Comando = require('../models/comando-git')
const Arquivo = require('../models/arquivo')
const Tarefa = require('../models/tarefa')
const Artefato = require('../models/artefato')
const SaidaVO = require('../models/saida-vo')

const geradorUtil = require('../util/gerador-util')

const TIPO_MODIFICACAO = require('./constants').TIPO_MODIFICACAO
const TIPO_ARTEFATO = require('./constants').TIPO_ARTEFATO

module.exports = (diretorio) => {

  return {

    listarDiretorios: async () => {

      try {

        let retorno = []

        if (fs.lstatSync(diretorio).isDirectory()) {

          retorno = fs.readdirSync(diretorio).filter((dir) => {

            const caminho = path.join(diretorio, dir)

            return (fs.lstatSync(caminho).isDirectory() &&
              dir === '.git')
          }).map((bar) => path.join(diretorio))

        } else {
          throw new Error(`${diretorio} não é um diretório`)
        }

        return retorno

      } catch (error) {
        throw new Error(error.message)
      }
    }
  }
}