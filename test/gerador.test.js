const gerador = require('../lib/gerador')
const Param = require('../models/param')
const fs = require('fs-extra')
const app = require('../package.json')
const crypto = require('crypto')

const NAME_APP = app.name
const PATH_TEST = '/tmp/' + NAME_APP

let git = {}

describe('test foo', () => {

    beforeEach(async () => {

        await createRepo('/apc-estatico')
        await createRepo('/crm-patrimonio-estatico')
    })

    it('test one', async () => {

        await createFile('0000000', '/crm-patrimonio-estatico/src/app/spas/imovel/documentos',
            'lista-documentos.tpl.html')

        await modifieFile('0000000', '/crm-patrimonio-estatico/src/app/spas/imovel/documentos',
            'lista-documentos.tpl.html')

        await modifieFile('1111111', '/crm-patrimonio-estatico/src/app/spas/imovel/documentos',
            'lista-documentos.tpl.html')

        const params = new Param({
            diretorio: PATH_TEST,
            autor: "fulano",
            projeto: ["apc-estatico", "crm-patrimonio-estatico"],
            task: ["0000000", "1111111"]
        })

        const lista = await gerador(params).gerarListaArtefato()

        expect(lista[0].listaNumTarefa).toHaveLength(2)
        expect(lista[0].listaArtefatoFoo[0].numeroAlteracao).toBe(2)
        expect(lista[0].listaArtefatoFoo[0].tipoAlteracao).toBe('M')

        expect(lista[1].listaNumTarefa).toHaveLength(1)
        expect(lista[1].listaArtefatoFoo[0].numeroAlteracao).toBe(1)
        expect(lista[1].listaArtefatoFoo[0].tipoAlteracao).toBe('A')
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

async function createRepo(path) {

    fs.mkdirsSync(PATH_TEST + path)

    git = require('simple-git/promise')(PATH_TEST + path)
    await git.init()
    await git.addConfig('user.name', 'fulano')
    await git.addConfig('user.email', 'fulano@fulano.com')
}

async function createFile(task, path, fileName) {
    fs.mkdirsSync(PATH_TEST + path)
    fs.writeFileSync(PATH_TEST + path + '/' + fileName, randomValueHex(12))
    await commitFile(task, path, fileName)
}

async function modifieFile(task, path, fileName) {
    fs.writeFileSync(PATH_TEST + path + '/' + fileName, randomValueHex(12))
    await commitFile(task, path, fileName)
}

async function commitFile(task, path, fileName) {W
    await git.add(PATH_TEST + path + '/' + fileName)
    await git.commit('task ' + task + ' commit')
}