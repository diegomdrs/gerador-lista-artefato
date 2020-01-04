const app = require('../package.json')
const crypto = require('crypto')
const path = require('path')
const fs = require('fs-extra')

const NAME_APP = app.name
// const PATH_TEST = __dirname + path.sep + NAME_APP
const PATH_TEST = '/tmp' + path.sep + NAME_APP

module.exports = class {

    static pathTest() {
        return PATH_TEST
    }

    static async criarEstrutura(listaEstrutura) {

        for (let estrutura of listaEstrutura) {

            const git = await this.criarRepo(estrutura.nomeProjeto)

            for (const artefato of estrutura.listaArtefato) {

                for (const tarefa of artefato.listaTarefa) {

                    for (let i = 0; i < tarefa.numAlteracao; i++) {

                        await this.manipularArquivo(git, estrutura.nomeProjeto,
                            tarefa.numTarefa, artefato.pathArtefato, tarefa.tipoAlteracao)
                    }
                }
            }
        }
    }

    static removerDiretorioTest() {
        fs.removeSync(PATH_TEST)
    }

    static async checkoutBranch(git, nomeBranch) {

        await git.checkoutLocalBranch(nomeBranch)
    }

    static async criarRepo(nomeProjeto) {

        const pathProjeto = PATH_TEST + '/' + nomeProjeto

        fs.mkdirsSync(pathProjeto)

        const git = require('simple-git/promise')(pathProjeto)

        await git.init()
        await git.addConfig('user.name', 'fulano')
        await git.addConfig('user.email', 'fulano@fulano.com')

        return git
    }

    static async manipularArquivo(git, nomeProjeto, task, pathArquivo, tipoAlteracao) {

        if (tipoAlteracao !== 'R') {

            if (tipoAlteracao === 'D') {

                fs.removeSync(obterCaminhoArquivo(nomeProjeto, pathArquivo))

            } else {

                fs.outputFileSync(obterCaminhoArquivo(nomeProjeto, pathArquivo), randomValueHex())
            }

            await commitarArquivo(git, nomeProjeto, task, pathArquivo)
        } else {

            if (tipoAlteracao === 'R') {

                fs.outputFileSync(obterCaminhoArquivo(git, pathArquivo.origem), randomValueHex())
                await commitarArquivo(git, nomeProjeto, task.origem, pathArquivo.origem)

                await git.mv(pathArquivo.origem, pathArquivo.destino)
                await commitarArquivo(git, nomeProjeto, task.destino, pathArquivo.destino)
            }
        }
    }
}

function randomValueHex() {
    return crypto.randomBytes(12).toString('hex')
}

async function commitarArquivo(git, nomeProjeto, task, pathArquivo) {

    await git.add(obterCaminhoArquivo(nomeProjeto, pathArquivo))
    await git.commit('task ' + task + ' commit')
}

function obterCaminhoArquivo(nomeProjeto, pathArquivo) {
    return PATH_TEST + path.sep + nomeProjeto + path.sep + pathArquivo
}