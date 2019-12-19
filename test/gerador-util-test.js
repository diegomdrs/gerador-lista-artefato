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
                        await criarArquivo(estrutura, tarefa.numTarefa, artefato.pathArtefato, tarefa.tipoAlteracao)
                    }
                }
            }
        }
    }

    static removerDiretorioTest() {
        fs.removeSync(PATH_TEST)
    }
}

function randomValueHex() {
    return crypto.randomBytes(12).toString('hex')
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

async function criarArquivo(git, task, pathArquivo, tipoAlteracao) {

    if (tipoAlteracao !== 'R') {

        if (tipoAlteracao === 'D') {

            fs.removeSync(obterCaminhoArquivo(git, pathArquivo))

        } else {

            fs.outputFileSync(obterCaminhoArquivo(git, pathArquivo), randomValueHex())
        }

        await commitarArquivo(git, task, pathArquivo)
    } else {

        if (tipoAlteracao === 'R') {

            fs.outputFileSync(obterCaminhoArquivo(git, pathArquivo.origem), randomValueHex())
            await commitarArquivo(git, task.origem, pathArquivo.origem)

            await git.repo.mv(pathArquivo.origem, pathArquivo.destino)
            await commitarArquivo(git, task.destino, pathArquivo.destino)
        }
    }
}

async function commitarArquivo(git, task, pathArquivo) {

    await git.repo.add(obterCaminhoArquivo(git, pathArquivo))
    await git.repo.commit('task ' + task + ' commit')
}

function obterCaminhoArquivo(git, pathArquivo) {
    return PATH_TEST + path.sep + git.nomeProjeto + path.sep + pathArquivo
}