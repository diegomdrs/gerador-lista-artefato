const gerador = require('../lib/gerador')
const Param = require('../models/param')
const fs = require('fs-extra')
const app = require('../package.json')
const crypto = require('crypto')

const NAME_APP = app.name
const PATH_TEST = '/tmp' + '/' + NAME_APP

let git = {}

describe('test foo', () => {

    beforeEach(async () => {

        if (fs.pathExistsSync(PATH_TEST)) {
            fs.removeSync(PATH_TEST)
        }

        fs.mkdirSync(PATH_TEST)

        git = require('simple-git/promise')(PATH_TEST)
        await git.init()

        // Criação
        fs.outputFileSync(PATH_TEST + '/arquivo1.txt')
        await git.add('./arquivo1.txt')
        await git.commit("task 1111111 commit")

        // Criação
        fs.outputFileSync(PATH_TEST + '/arquivo2.txt')
        await git.add('./arquivo2.txt')
        await git.commit("task 2222222 commit")

        // Criação
        fs.outputFileSync(PATH_TEST + '/arquivo3.txt')
        await git.add('./arquivo3.txt')
        await git.commit("task 2222222 commit")

        // Modificação
        fs.outputFileSync(PATH_TEST + '/arquivo1.txt', randomValueHex(12))
        await git.add('./arquivo1.txt')
        await git.commit("task 1111111 commit")

        // Modificação
        fs.outputFileSync(PATH_TEST + '/arquivo1.txt', randomValueHex(12))
        await git.add('./arquivo1.txt')
        await git.commit("task 2222222 commit")

        // Modificação
        fs.outputFileSync(PATH_TEST + '/arquivo1.txt', randomValueHex(12))
        await git.add('./arquivo1.txt')
        await git.commit("task 2222222 commit")
    })

    it('test one', async () => {

        const params = new Param({
            diretorio: "/tmp",
            autor: "diegomdrs",
            projeto: NAME_APP,
            task: ["1111111", "2222222"]
        })

        const retorno = await gerador(params).gerarListaArtefato()

        console.log('listaArtefatoTarefaMesmoTipo ================================================')
        for (const artefato of retorno.listaArtefato) {
            console.log(artefato.nomeArtefato + ' ##########################')
            console.table(artefato.listaTarefa)
        }

        console.log('listaArtefatoTarefasIguais   ================================================')
        for (const tarefaFoo of retorno.listaTarefaFoo) {
            console.table(tarefaFoo.listaArtefatoFoo)
        }

        expect(retorno).toBeDefined()
    })

    afterEach(() => {

        fs.removeSync(PATH_TEST)
    })
})

function randomValueHex(len) {
    return crypto
        .randomBytes(Math.ceil(len / 2))
        .toString('hex')
        .slice(0, len)
}