const gerador = require('../lib/gerador')
const Param = require('../models/param')
const fs = require('fs-extra')
const app = require('../package.json')
const crypto = require('crypto')
const path = require('path')

const NAME_APP = app.name
const PATH_TEST = __dirname + path.sep + NAME_APP

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
                        pathArtefato: 'src/app/spas/imovel/pagamentos-pendentes/lista-pagamentos-pendentes-controllers.js',
                        listaTarefa: [
                            { numTarefa: '0000000', numAlteracao: 1, tipoAlteracao: 'A' },
                            { numTarefa: '1199211', numAlteracao: 2, tipoAlteracao: 'M' },
                            { numTarefa: '1203082', numAlteracao: 3, tipoAlteracao: 'M' },
                            { numTarefa: '1207175', numAlteracao: 3, tipoAlteracao: 'M' }
                        ]
                    },
                    {
                        pathArtefato: 'src/app/spas/imovel/documentos/lista-documentos-controllers.js',
                        listaTarefa: [
                            { numTarefa: '0000000', numAlteracao: 1, tipoAlteracao: 'A' },
                            { numTarefa: '1203670', numAlteracao: 4, tipoAlteracao: 'M' },
                            { numTarefa: '1210684', numAlteracao: 5, tipoAlteracao: 'M' }
                        ]
                    },
                    {
                        pathArtefato: 'src/app/spas/imovel/inclusao-ocupante-imovel/inclusao-ocupante-imovel.tpl.html',
                        listaTarefa: [
                            { numTarefa: '0000000', numAlteracao: 1, tipoAlteracao: 'A' },
                            { numTarefa: '1199211', numAlteracao: 2, tipoAlteracao: 'M' }
                        ]
                    },
                    {
                        pathArtefato: 'src/app/spas/imovel/pagamentos-pendentes/lista-pagamentos-pendentes.tpl.html',
                        listaTarefa: [
                            { numTarefa: '0000000', numAlteracao: 1, tipoAlteracao: 'A' },
                            { numTarefa: '1199211', numAlteracao: 4, tipoAlteracao: 'M' }
                        ]
                    },
                    {
                        pathArtefato: 'src/app/crm/crm-constantes.js',
                        listaTarefa: [
                            { numTarefa: '0000000', numAlteracao: 1, tipoAlteracao: 'A' },
                            { numTarefa: '1199211', numAlteracao: 2, tipoAlteracao: 'M' }
                        ]
                    },
                    {
                        pathArtefato: 'src/styles/crm.css',
                        listaTarefa: [
                            { numTarefa: '0000000', numAlteracao: 1, tipoAlteracao: 'A' },
                            { numTarefa: '1199211', numAlteracao: 1, tipoAlteracao: 'M' }
                        ]
                    }
                ]
            }
        ]

        await criarEstrutura(listaFoo)

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

        expect(lista[4].listaNumTarefa).toHaveLength(3)
        expect(lista[4].listaArtefatoFoo[0].numeroAlteracao).toBe(8)
        expect(lista[4].listaArtefatoFoo[0].tipoAlteracao).toBe('M')

        expect(lista[5].listaNumTarefa).toHaveLength(2)
        expect(lista[5].listaArtefatoFoo[0].numeroAlteracao).toBe(9)
        expect(lista[5].listaArtefatoFoo[0].tipoAlteracao).toBe('M')

        expect(lista[6].listaNumTarefa).toHaveLength(1)
        expect(lista[6].listaArtefatoFoo[0].numeroAlteracao).toBe(2)
        expect(lista[6].listaArtefatoFoo[1].numeroAlteracao).toBe(4)
        expect(lista[6].listaArtefatoFoo[2].numeroAlteracao).toBe(2)
        expect(lista[6].listaArtefatoFoo[3].numeroAlteracao).toBe(1)
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

async function criarEstrutura(listaFoo) {

    for (const foo of listaFoo) {

        foo.repo = await criarRepo(foo.nomeProjeto)

        for (const artefato of foo.listaArtefato) {

            for (const tarefa of artefato.listaTarefa) {

                for (let i = 0; i < tarefa.numAlteracao; i++) {
                    await criarArquivo(foo, tarefa.numTarefa, artefato.pathArtefato)
                }
            }
        }
    }
}

async function criarRepo(nomeProjeto) {

    const pathProjeto = PATH_TEST + '/' + nomeProjeto

    fs.mkdirsSync(pathProjeto)

    const git = require('simple-git/promise')(pathProjeto)

    await git.init()
    await git.addConfig('user.name', 'fulano')
    await git.addConfig('user.email', 'fulano@fulano.com')

    return git
}

async function criarArquivo(git, task, pathArquivo) {

    fs.outputFileSync(obterCaminhoArquivo(git, pathArquivo), randomValueHex(12))

    await commitarArquivo(git, task, pathArquivo)
}

async function commitarArquivo(git, task, pathArquivo) {

    await git.repo.add(obterCaminhoArquivo(git, pathArquivo))
    await git.repo.commit('task ' + task + ' commit')
}

function obterCaminhoArquivo(git, pathArquivo) {
    return PATH_TEST + path.sep + git.nomeProjeto + path.sep + pathArquivo
}