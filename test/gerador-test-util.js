const path = require('path')
const crypto = require('crypto')
const fs = require('fs-extra')

const { TIPO_MODIFICACAO } = require('../lib/constants')
const APP_NAME = require('../package.json').name
const DIRETORIO_TEST = '/tmp' + path.sep + APP_NAME

module.exports = function (caminho, autor) {

    this.caminho = DIRETORIO_TEST + path.sep + caminho
    this.autor = autor

    this.criarRepo = async function () {

        this.removerDiretorioProjeto()

        fs.mkdirsSync(this.caminho)

        this.git = require('simple-git')(this.caminho)

        await this.git.init()
        await this.git.addConfig('user.name', this.autor)
        await this.git.addConfig('user.email', `${this.autor}@${this.autor}.com`)
    }

    this.obterCaminhoProjeto = function () {
        return `${this.caminho}`
    }

    this.obterCaminhoArquivo = function (pathArquivo) {
        return `${this.caminho}/${pathArquivo}`
    }

    this.removerDiretorioProjeto = async function () {
        fs.removeSync(this.caminho)
    }

    this.removerDiretorioTest = async function () {
        fs.removeSync(DIRETORIO_TEST)
    }

    this.checkoutBranch = async function (nomeBranch) {
        await this.git.checkoutLocalBranch(nomeBranch)
    }

    this.manipularArquivoComCommit = async function (task, pathArquivo, tipoAlteracao, date) {

        if (tipoAlteracao !== TIPO_MODIFICACAO.RENAMED) {

            if (tipoAlteracao === TIPO_MODIFICACAO.DELETED)
                fs.removeSync(this.obterCaminhoArquivo(pathArquivo))
            else
                fs.outputFileSync(this.obterCaminhoArquivo(pathArquivo), randomValueHex())

            await this.commitarArquivo(task, pathArquivo, date)
        } else {

            await this.git.mv(pathArquivo.origem, pathArquivo.destino)
            await this.commitarArquivo(task, pathArquivo.destino, date)
        }
    }

    this.manipularArquivoComCommxxxxit = async function ({task, pathArquivo, tipoAlteracao}) {

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

    this.commitarArquivo = async function (task, pathArquivo, date) {

        if(date) {
            await this.git.env('GIT_AUTHOR_DATE', date)
            await this.git.env('GIT_COMMITTER_DATE', date)
        }

        await this.git.add(this.obterCaminhoArquivo(pathArquivo))
        await this.git.commit(`task ${task} commit`)
    }

    this.commitarProjeto = async function (task, listaArquivo) {

        for (const arquivo of listaArquivo) {
            await this.git.add(this.obterCaminhoArquivo(arquivo.pathArquivo))
        }

        await this.git.commit(`task ${task} commit`)
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