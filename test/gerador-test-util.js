const app = require('../package.json')
const crypto = require('crypto')
const path = require('path')
const fs = require('fs-extra')

const NAME_APP = app.name
const PATH_TEST = '/tmp' + path.sep + NAME_APP

module.exports = {

    async criarRepo(nomeProjeto, autor) {

        this.nomeProjeto = nomeProjeto

        const pathProjeto = PATH_TEST + '/' + this.nomeProjeto

        this.removerDiretorioTest(pathProjeto)

        fs.mkdirsSync(pathProjeto)

        this.git = require('simple-git/promise')(pathProjeto)

        await this.git.init()
        await this.git.addConfig('user.name', autor)
        await this.git.addConfig('user.email', `${autor}@${autor}.com`)

        return this
    },

    pathTest() {
        return PATH_TEST
    },

    async removerDiretorioTest(path) {
        fs.removeSync(path)
    },

    async checkoutBranch(nomeBranch) {
        await this.git.checkoutLocalBranch(nomeBranch)
    },

    async manipularArquivoComCommit(task, pathArquivo, tipoAlteracao) {

        if (tipoAlteracao !== 'R') {

            if (tipoAlteracao === 'D') {

                fs.removeSync(this.obterCaminhoArquivo(pathArquivo))

            } else {

                fs.outputFileSync(this.obterCaminhoArquivo(pathArquivo), randomValueHex())
            }

            await this.commitarArquivo(task, pathArquivo)
        } else {

            fs.outputFileSync(this.obterCaminhoArquivo(pathArquivo.origem), randomValueHex())
            await this.commitarArquivo(task.origem, pathArquivo.origem)

            await this.git.mv(pathArquivo.origem, pathArquivo.destino)
            await this.commitarArquivo(task.destino, pathArquivo.destino)
        }
    },

    async manipularArquivoSemCommit(pathArquivo, tipoAlteracao) {

        if (tipoAlteracao !== 'R') {

            if (tipoAlteracao === 'D') {

                fs.removeSync(this.obterCaminhoArquivo(pathArquivo))

            } else {

                fs.outputFileSync(this.obterCaminhoArquivo(pathArquivo), randomValueHex())
            }
        } else {

            fs.outputFileSync(this.obterCaminhoArquivo(pathArquivo.origem), randomValueHex())
            await this.git.mv(pathArquivo.origem, pathArquivo.destino)
        }
    },

    async manipularListaArquivoComCommit(tarefa, listaArquivo) {
        for (const arquivo of listaArquivo)
            await this.manipularArquivoSemCommit(this.nomeProjeto,
                arquivo.pathArquivo, arquivo.tipoAlteracao)

        await this.commitarProjeto(tarefa, listaArquivo)
    },

    async commitarArquivo(task, pathArquivo) {

        await this.git.add(this.obterCaminhoArquivo(pathArquivo))
        await this.git.commit('task ' + task + ' commit')
    },

    async commitarProjeto(task, listaArquivo) {

        for (const arquivo of listaArquivo) {
            await this.git.add(this.obterCaminhoArquivo(arquivo.pathArquivo))
        }

        await this.git.commit('task ' + task + ' commit')
    },

    async criarEstrutura(listaEstrutura, autor) {

        for (let estrutura of listaEstrutura) {

            const git = await this.criarRepo(estrutura.nomeProjeto, autor)

            for (const artefato of estrutura.listaArtefato) {

                for (const tarefa of artefato.listaTarefa) {

                    for (let i = 0; i < tarefa.numAlteracao; i++)
                        await this.manipularArquivoComCommit(estrutura.nomeProjeto,
                            tarefa.numeroTarefa, artefato.pathArtefato, tarefa.tipoAlteracao)
                }
            }
        }
    },

    obterCaminhoArquivo(pathArquivo) {
        return PATH_TEST + path.sep + this.nomeProjeto + path.sep + pathArquivo
    }
}

function randomValueHex() {
    return crypto.randomBytes(12).toString('hex')
}