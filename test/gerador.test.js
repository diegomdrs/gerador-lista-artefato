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

    it('test', async () => {

        const listaFoo = [
            {
                repo: {},
                nomeProjeto: 'apc-estatico',
                listaArtefato: [{
                    pathArtefato: 'package.json',
                    listaTarefa: [
                        { numTarefa: '0000000', numAlteracao: 1, tipoAlteracao: 'A' },
                        { numTarefa: '1207175', numAlteracao: 1, tipoAlteracao: 'M' },
                        { numTarefa: '1212444', numAlteracao: 1, tipoAlteracao: 'M' }
                    ]
                }]
            },
            {
                repo: {},
                nomeProjeto: 'crm-patrimonio-estatico',
                listaArtefato: [
                    {
                        pathArtefato: 'src/app/spas/imovel/documentos/lista-documentos.tpl.html',
                        listaTarefa: [
                            { numTarefa: '0000000', numAlteracao: 1, tipoAlteracao: 'A' },
                            { numTarefa: '1203670', numAlteracao: 1, tipoAlteracao: 'M' },
                            { numTarefa: '1210684', numAlteracao: 1, tipoAlteracao: 'M' }
                        ]
                    },
                    {
                        pathArtefato: 'package.json',
                        listaTarefa: [
                            { numTarefa: '0000000', numAlteracao: 1, tipoAlteracao: 'A' },
                            { numTarefa: '1199211', numAlteracao: 1, tipoAlteracao: 'M' },
                            { numTarefa: '1203082', numAlteracao: 2, tipoAlteracao: 'M' },
                            { numTarefa: '1203670', numAlteracao: 1, tipoAlteracao: 'M' },
                            { numTarefa: '1207175', numAlteracao: 2, tipoAlteracao: 'M' },
                            { numTarefa: '1210684', numAlteracao: 2, tipoAlteracao: 'M' }
                        ]
                    },
                    {
                        pathArtefato: 'Gruntfile.js',
                        listaTarefa: [
                            { numTarefa: '0000000', numAlteracao: 1, tipoAlteracao: 'A' },
                            { numTarefa: '1199211', numAlteracao: 1, tipoAlteracao: 'M' },
                            { numTarefa: '1203670', numAlteracao: 1, tipoAlteracao: 'M' },
                            { numTarefa: '1210684', numAlteracao: 1, tipoAlteracao: 'M' }
                        ]
                    },
                    {
                        pathArtefato: 'src/app/spas/imovel/documentos/lista-documentos-controllers.js',
                        listaTarefa: [
                            { numTarefa: '0000000', numAlteracao: 1, tipoAlteracao: 'A' },
                            { numTarefa: '1203670', numAlteracao: 4, tipoAlteracao: 'M' },
                            { numTarefa: '1210684', numAlteracao: 5, tipoAlteracao: 'M' }
                        ]
                    }
                ]
            }
        ]

        await bar(listaFoo)

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

        expect(lista[3].listaNumTarefa).toHaveLength(3)
        expect(lista[3].listaArtefatoFoo[0].numeroAlteracao).toBe(3)
        expect(lista[3].listaArtefatoFoo[0].tipoAlteracao).toBe('M')

        expect(lista[4].listaNumTarefa).toHaveLength(2)
        expect(lista[4].listaArtefatoFoo[0].numeroAlteracao).toBe(9)
        expect(lista[4].listaArtefatoFoo[0].tipoAlteracao).toBe('M')
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

async function bar(listaFoo) {

    for (const foo of listaFoo) {

        foo.repo = await createRepo(foo.nomeProjeto)

        for (const artefato of foo.listaArtefato) {

            for (const tarefa of artefato.listaTarefa) {

                for (let i = 0; i < tarefa.numAlteracao; i++) {

                    await fooFile(foo.repo, foo.nomeProjeto, tarefa.numTarefa, artefato.pathArtefato)
                }
            }
        }
    }
}

async function createRepo(path) {

    fs.mkdirsSync(PATH_TEST + '/' + path)

    const git = require('simple-git/promise')(PATH_TEST + '/' + path)

    await git.init()
    await git.addConfig('user.name', 'fulano')
    await git.addConfig('user.email', 'fulano@fulano.com')

    return git
}

async function fooFile(git, nomeProjeto, task, path) {

    fs.outputFileSync(PATH_TEST + '/' + nomeProjeto +
        '/' + path, randomValueHex(12))

    await commitFile(git, nomeProjeto, task, path)
}

async function commitFile(git, nomeProjeto, task, path) {

    await git.add(PATH_TEST + '/' + nomeProjeto + '/' + path)
    await git.commit('task ' + task + ' commit')
}