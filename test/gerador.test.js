const gerador = require('../lib/gerador')
const Param = require('../models/param')
const fs = require('fs-extra')
const app = require('../package.json')
const crypto = require('crypto')

const NAME_APP = app.name
const PATH_TEST = '/tmp/' + NAME_APP

describe('test foo', () => {

    beforeEach(async () => {

    })

    it('test one', async () => {

        const repoApcEstatico = await createRepo('/apc-estatico')
        const repoCrmPatrimonioEstatico = await createRepo('/crm-patrimonio-estatico')

        //  apc-estatico/package.json
        await createFile(repoApcEstatico,  '0000000', '/apc-estatico', 'package.json')
        await modifieFile(repoApcEstatico, '1207175', '/apc-estatico', 'package.json')
        await modifieFile(repoApcEstatico, '1212444', '/apc-estatico', 'package.json')

        // crm-patrimonio-estatico/src/app/spas/imovel/documentos/lista-documentos.tpl.html
        await createFile(repoCrmPatrimonioEstatico,  '000000',
            '/crm-patrimonio-estatico/src/app/spas/imovel/documentos', 'lista-documentos.tpl.html')
        await modifieFile(repoCrmPatrimonioEstatico, '1203670',
            '/crm-patrimonio-estatico/src/app/spas/imovel/documentos', 'lista-documentos.tpl.html')
        await modifieFile(repoCrmPatrimonioEstatico, '1210684',
            '/crm-patrimonio-estatico/src/app/spas/imovel/documentos', 'lista-documentos.tpl.html')

        // crm-patrimonio-estatico/package.json  
        await createFile( repoCrmPatrimonioEstatico, '0000000', '/crm-patrimonio-estatico', 'package.json')
        await modifieFile(repoCrmPatrimonioEstatico, '1199211', '/crm-patrimonio-estatico', 'package.json')
        await modifieFile(repoCrmPatrimonioEstatico, '1199211', '/crm-patrimonio-estatico', 'package.json')
        await modifieFile(repoCrmPatrimonioEstatico, '1203082', '/crm-patrimonio-estatico', 'package.json')
        await modifieFile(repoCrmPatrimonioEstatico, '1203082', '/crm-patrimonio-estatico', 'package.json')
        await modifieFile(repoCrmPatrimonioEstatico, '1203670', '/crm-patrimonio-estatico', 'package.json')
        await modifieFile(repoCrmPatrimonioEstatico, '1203670', '/crm-patrimonio-estatico', 'package.json')
        await modifieFile(repoCrmPatrimonioEstatico, '1207175', '/crm-patrimonio-estatico', 'package.json')
        await modifieFile(repoCrmPatrimonioEstatico, '1210684', '/crm-patrimonio-estatico', 'package.json')

        const params = new Param({
            diretorio: PATH_TEST,
            autor: "fulano",
            projeto: ["apc-estatico", "crm-patrimonio-estatico"],
            task: [1199211, 1203082, 1203670, 1207175, 1210684, 1210658, 1212262, 1212444]
        })

        const lista = await gerador(params).gerarListaArtefato()

        expect(lista[0].listaNumTarefa).toHaveLength(2)
        expect(lista[0].listaArtefatoFoo[0].numeroAlteracao).toBe(2)
        expect(lista[0].listaArtefatoFoo[0].tipoAlteracao).toBe('M')

        expect(lista[1].listaNumTarefa).toHaveLength(2)
        expect(lista[1].listaArtefatoFoo[0].numeroAlteracao).toBe(2)
        expect(lista[1].listaArtefatoFoo[0].tipoAlteracao).toBe('M')

        expect(lista[2].listaNumTarefa).toHaveLength(5)
        expect(lista[2].listaArtefatoFoo[0].numeroAlteracao).toBe(8)
        expect(lista[2].listaArtefatoFoo[0].tipoAlteracao).toBe('M')
    })

    afterEach(() => {

        fs.removeSync(PATH_TEST)
    })
})

function randomValueHex(len) {
    return crypto.randomBytes(Math.ceil(len / 2))
        .toString('hex')
        .slice(0, len)
}

async function createRepo(path) {

    fs.mkdirsSync(PATH_TEST + path)

    const git = require('simple-git/promise')(PATH_TEST + path)

    await git.init()
    await git.addConfig('user.name', 'fulano')
    await git.addConfig('user.email', 'fulano@fulano.com')

    return git
}

async function createFile(git, task, path, fileName) {

    fs.mkdirsSync(PATH_TEST + path)
    fs.writeFileSync(PATH_TEST + path + '/' + fileName, randomValueHex(12))

    await commitFile(git, task, path, fileName)
}

async function modifieFile(git, task, path, fileName) {

    fs.writeFileSync(PATH_TEST + path + '/' + fileName, randomValueHex(12))

    await commitFile(git, task, path, fileName)
}

async function commitFile(git, task, path, fileName) {

    await git.add(PATH_TEST + path + '/' + fileName)
    await git.commit('task ' + task + ' commit')
}