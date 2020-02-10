const app = require('../package.json')
const crypto = require('crypto')
const path = require('path')
const fs = require('fs-extra')

const TIPO_MODIFICACAO = require('../lib/constants').TIPO_MODIFICACAO

const NAME_APP = app.name
const PATH_TEST = '/tmp' + path.sep + NAME_APP

module.exports = function (nomeProjeto, autor) {

    this.nomeProjeto = nomeProjeto
    this.autor = autor

    this.criarRepo = async function () {

        this.removerDiretorioTest(this.obterCaminhoProjeto())

        fs.mkdirsSync(this.obterCaminhoProjeto())

        this.git = require('simple-git/promise')(this.obterCaminhoProjeto())

        await this.git.init()
        await this.git.addConfig('user.name', this.autor)
        await this.git.addConfig('user.email', `${this.autor}@${this.autor}.com`)
    }

    this.obterCaminhoProjeto = function () {
        return `${PATH_TEST}/${this.nomeProjeto}`
    }

    this.obterCaminhoArquivo = function (pathArquivo) {
        return `${this.obterCaminhoProjeto()}/${pathArquivo}`
    }

    this.removerDiretorioTest = async function (path) {
        fs.removeSync(path)
    }

    this.checkoutBranch = async function (nomeBranch) {
        await this.git.checkoutLocalBranch(nomeBranch)
    }

    this.manipularArquivoComCommit = async function (task, pathArquivo, tipoAlteracao) {

        if (tipoAlteracao !== TIPO_MODIFICACAO.RENAMED) {

            if (tipoAlteracao === TIPO_MODIFICACAO.DELETED)
                fs.removeSync(this.obterCaminhoArquivo(pathArquivo))
            else
                fs.outputFileSync(this.obterCaminhoArquivo(pathArquivo), randomValueHex())

            await this.commitarArquivo(task, pathArquivo)
        } else {

            await this.git.mv(pathArquivo.origem, pathArquivo.destino)
            await this.commitarArquivo(task, pathArquivo.destino)
        }
    }

    this.manipularArquivoSemCommit = async function (pathArquivo, tipoAlteracao) {

        if (tipoAlteracao !== TIPO_MODIFICACAO.RENAMED) {

            if (tipoAlteracao === TIPO_MODIFICACAO.DELETED)
                fs.removeSync(this.obterCaminhoArquivo(pathArquivo))
            else
                fs.outputFileSync(this.obterCaminhoArquivo(pathArquivo), randomValueHex())
        } else {

            fs.outputFileSync(this.obterCaminhoArquivo(pathArquivo.origem), randomValueHex())
            await this.git.mv(pathArquivo.origem, pathArquivo.destino)
        }
    }

    this.manipularListaArquivoComCommit = async function (tarefa, listaArquivo) {

        for (const arquivo of listaArquivo)
            await this.manipularArquivoSemCommit(arquivo.pathArquivo, arquivo.tipoAlteracao)

        await this.commitarProjeto(tarefa, listaArquivo)
    }

    this.commitarArquivo = async function (task, pathArquivo) {

        await this.git.add(this.obterCaminhoArquivo(pathArquivo))
        await this.git.commit(`task ${task} commit`)
    }

    this.commitarProjeto = async function (task, listaArquivo) {

        for (const arquivo of listaArquivo) {
            await this.git.add(this.obterCaminhoArquivo(arquivo.pathArquivo))
        }

        await this.git.commit(`task ${task} commit`)
    }

    this.criarEstrutura = async function (listaEstrutura, autor) {

        for (let estrutura of listaEstrutura) {

            await this.criarRepo(estrutura.nomeProjeto, autor)

            for (const artefato of estrutura.listaArtefato) {

                for (const tarefa of artefato.listaTarefa) {

                    for (let i = 0; i < tarefa.numAlteracao; i++)

                        await this.manipularArquivoComCommit(estrutura.nomeProjeto,
                            tarefa.numeroTarefa, artefato.pathArtefato, tarefa.tipoAlteracao)
                }
            }
        }
    }

    this.stash = async function () {
        await this.git.stash()
    }

    return new Promise(async (resolve, reject) => {
        try {
            await this.criarRepo();

            resolve(this);
        } catch (err) {
            reject(err);
        }
    })
}

function randomValueHex() {
    return crypto.randomBytes(12).toString('hex')
}