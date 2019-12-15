const gerador = require('../lib/gerador')
const Param = require('../models/param')
const fs = require('fs-extra')
const app = require('../package.json')

const NAME_APP = app.name
const PATH_TEST = '/tmp' + '/' + NAME_APP

let git = {}

describe('test foo', () => {

    beforeEach(async () => {

        if (fs.pathExistsSync(PATH_TEST)) {
            fs.removeSync(PATH_TEST)
        }

        fs.mkdirSync(PATH_TEST)
        fs.outputFileSync(PATH_TEST + '/arquivo.txt')

        git = require('simple-git/promise')(PATH_TEST)

        await git.init()
        await git.add('./*')
        await git.commit("task 1111111 commit")
    })

    it('test one', async () => {

        const params = new Param({
            diretorio: "/tmp",
            autor: "diegomdrs",
            projeto: NAME_APP,
            task: "1111111"
        })

        const retorno = await gerador(params).gerarListaArtefato()

        expect(retorno).toBeDefined()
    })

    afterEach(() => {

        fs.removeSync(PATH_TEST)
    })
})