const gerador = require('../lib/gerador')
const Param = require('../models/param')
const fs = require('fs-extra')
const app = require('../package.json')

const NAME_APP = app.name
const PATH_TEST = 'test/' + NAME_APP

let git = {}

describe('test foo', () => {

    beforeEach(() => {

        fs.mkdirSync(PATH_TEST)
        fs.outputFile(PATH_TEST + '/arquivo.txt')

        git = require('simple-git')(PATH_TEST)
            .init()
            .add('./*')
            .commit("task 1111111 commit")
    })

    it('test one', async () => {

        const params = new Param({
            diretorio: "test",
            autor: "diegomdrs",
            projeto: NAME_APP,
            task: "1111111"
        })

        const foo = await gerador(params).gerarListaArtefato()

        console.log(foo)
    })

    afterEach(() => {

        fs.removeSync(PATH_TEST)
    })
})