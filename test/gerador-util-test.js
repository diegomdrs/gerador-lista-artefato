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

    static async criarEstrutura(listaEstrutura, autor) {

        for (let estrutura of listaEstrutura) {

            const git = await this.criarRepo(estrutura.nomeProjeto, autor)

            for (const artefato of estrutura.listaArtefato) {

                for (const tarefa of artefato.listaTarefa) {

                    for (let i = 0; i < tarefa.numAlteracao; i++)
                        await this.manipularArquivoComCommit(git, estrutura.nomeProjeto,
                            tarefa.numeroTarefa, artefato.pathArtefato, tarefa.tipoAlteracao)
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

    static async criarRepo(nomeProjeto, autor) {

        const pathProjeto = PATH_TEST + '/' + nomeProjeto

        fs.mkdirsSync(pathProjeto)

        const git = require('simple-git/promise')(pathProjeto)

        await git.init()
        await git.addConfig('user.name', autor)
        await git.addConfig('user.email', `${autor}@${autor}.com`)

        return git
    }

    static async manipularArquivoComCommit(git, nomeProjeto, task, pathArquivo, tipoAlteracao) {

        if (tipoAlteracao !== 'R') {

            if (tipoAlteracao === 'D') {

                fs.removeSync(obterCaminhoArquivo(nomeProjeto, pathArquivo))

            } else {

                fs.outputFileSync(obterCaminhoArquivo(nomeProjeto, pathArquivo), randomValueHex())
            }

            await this.commitarArquivo(git, nomeProjeto, task, pathArquivo)
        } else {

            fs.outputFileSync(obterCaminhoArquivo(git, pathArquivo.origem), randomValueHex())
            await this.commitarArquivo(git, nomeProjeto, task.origem, pathArquivo.origem)

            await git.mv(pathArquivo.origem, pathArquivo.destino)
            await this.commitarArquivo(git, nomeProjeto, task.destino, pathArquivo.destino)
        }
    }

    static async manipularArquivoSemCommit(git, nomeProjeto, pathArquivo, tipoAlteracao) {

        if (tipoAlteracao !== 'R') {

            if (tipoAlteracao === 'D') {

                fs.removeSync(obterCaminhoArquivo(nomeProjeto, pathArquivo))

            } else {

                fs.outputFileSync(obterCaminhoArquivo(nomeProjeto, pathArquivo), randomValueHex())
            }
        } else {

            fs.outputFileSync(obterCaminhoArquivo(git, pathArquivo.origem), randomValueHex())
            await git.mv(pathArquivo.origem, pathArquivo.destino)
        }
    }

    static async commitarArquivo(git, nomeProjeto, task, pathArquivo) {

        await git.add(obterCaminhoArquivo(nomeProjeto, pathArquivo))
        await git.commit('task ' + task + ' commit')
    }

    static async commitarProjeto(git, nomeProjeto, task, listaArquivo) {

        for (const arquivo of listaArquivo) {
            await git.add(obterCaminhoArquivo(nomeProjeto, arquivo.pathArquivo))
        }

        await git.commit('task ' + task + ' commit')
    }

    static async manipularListaArquivoSemCommit(git, tarefa, nomeProjeto, listaArquivo) {
        for (const arquivo of listaArquivo)
            await this.manipularArquivoSemCommit(git, nomeProjeto,
                arquivo.pathArquivo, arquivo.tipoAlteracao)

        await this.commitarProjeto(git, nomeProjeto, tarefa, listaArquivo)
    }
}

function randomValueHex() {
    return crypto.randomBytes(12).toString('hex')
}

function obterCaminhoArquivo(nomeProjeto, pathArquivo) {
    return PATH_TEST + path.sep + nomeProjeto + path.sep + pathArquivo
}