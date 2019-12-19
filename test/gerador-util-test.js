const app = require('../package.json')
const crypto = require('crypto')
const path = require('path')
const fs = require('fs-extra')

const NAME_APP = app.name
const PATH_TEST = __dirname + path.sep + NAME_APP

module.exports = class {

    static pathTest() {
        return PATH_TEST
    }

    static async criarEstrutura(listaEstrutura) {

        for (const estrutura of listaEstrutura) {

            estrutura.repo = await criarRepo(estrutura.nomeProjeto)

            for (const artefato of estrutura.listaArtefato) {

                for (const tarefa of artefato.listaTarefa) {

                    for (let i = 0; i < tarefa.numAlteracao; i++) {
                        await criarArquivo(estrutura, tarefa.numTarefa, artefato.pathArtefato)
                    }
                }
            }
        }
    }

    static removerDiretorioTest() {
        fs.removeSync(PATH_TEST)
    }
}

function randomValueHex(len) {
    return crypto.randomBytes(Math.ceil(len / 2))
        .toString('hex')
        .slice(0, len)
}

async function criarRepo(nomeProjeto) {

    const pathProjeto = PATH_TEST + '/' + nomeProjeto

    fs.mkdirsSync(pathProjeto)

    const git = require('simple-git/promise')(pathProjeto)

    await git.init()
    await git.addConfig('user.name', 'fulano')
    await git.addConfig('user.email', 'fulano@fulano.com')

    return git
}

async function criarArquivo(git, task, pathArquivo) {

    fs.outputFileSync(obterCaminhoArquivo(git, pathArquivo), randomValueHex(12))

    await commitarArquivo(git, task, pathArquivo)
}

async function commitarArquivo(git, task, pathArquivo) {

    await git.repo.add(obterCaminhoArquivo(git, pathArquivo))
    await git.repo.commit('task ' + task + ' commit')
}

function obterCaminhoArquivo(git, pathArquivo) {
    return PATH_TEST + path.sep + git.nomeProjeto + path.sep + pathArquivo
}