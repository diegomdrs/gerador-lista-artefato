const gerador = require('../lib/gerador')
const Param = require('../models/param')
const fs = require('fs-extra')
const foo = require('../package.json')

const NAME_APP = foo.name
const PATH_TEST = '/tmp/' + NAME_APP

let git = {}

describe('test foo', () => {

    beforeEach(() => {

        fs.mkdirSync(PATH_TEST)
        git = require('simple-git')(PATH_TEST)
        git.init()
    })

    it('test one', () => {

        const params = new Param({
            diretorio: "/home/foo/Documents",
            autor: "diegomdrs",
            projeto: ["foo-estatico", "foo-api"],
            task: ["1111111"]
        })

        gerador(params)
    })

    afterEach(() => {

        fs.removeSync(PATH_TEST)
    })
})