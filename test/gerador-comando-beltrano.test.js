const Param = require('../models/param')
const geradorUtilTest = require('./gerador-util-test')

const autor = 'beltrano'

const TIPO_MODIFICACAO = require('../lib/constants').TIPO_MODIFICACAO

describe('test comando fulano', () => {

    beforeAll(async () => {

        geradorUtilTest.removerDiretorioTest()

        jest.setTimeout(10000)

        listaEstrutura = [
            {
                nomeProjeto: 'bar-estatico',
                listaArtefato: [{
                    pathArtefato: 'package.json',
                    listaTarefa: [
                        { numeroTarefa: '0000000', numAlteracao: 1, tipoAlteracao: TIPO_MODIFICACAO.ADDED },
                        { numeroTarefa: '1207175', numAlteracao: 1, tipoAlteracao: TIPO_MODIFICACAO.MODIFIED },
                        { numeroTarefa: '1212444', numAlteracao: 1, tipoAlteracao: TIPO_MODIFICACAO.MODIFIED }
                    ]
                },
                {
                    pathArtefato: 'src/app/spas/garply/consulta/detalhaContrato/cronogramaParcelas/detalha-cronograma-parcela.tpl.html',
                    listaTarefa: [
                        { numeroTarefa: '0000000', numAlteracao: 1, tipoAlteracao: TIPO_MODIFICACAO.ADDED },
                        { numeroTarefa: '1212444', numAlteracao: 1, tipoAlteracao: TIPO_MODIFICACAO.MODIFIED }
                    ]
                },
                {
                    pathArtefato: 'src/app/spas/garply/consulta/detalhaContrato/cronogramaParcelas/detalha-cronograma-parcela-controllers.js',
                    listaTarefa: [
                        { numeroTarefa: '0000000', numAlteracao: 1, tipoAlteracao: TIPO_MODIFICACAO.ADDED },
                        { numeroTarefa: '1212444', numAlteracao: 1, tipoAlteracao: TIPO_MODIFICACAO.MODIFIED }
                    ]
                }]
            },
            {
                nomeProjeto: 'qux-estatico',
                listaArtefato: [
                    {
                        pathArtefato: 'src/app/spas/imovel/documentos/lista-documentos.tpl.html',
                        listaTarefa: [
                            { numeroTarefa: '0000000', numAlteracao: 1, tipoAlteracao: TIPO_MODIFICACAO.ADDED },
                            { numeroTarefa: '1203670', numAlteracao: 1, tipoAlteracao: TIPO_MODIFICACAO.MODIFIED },
                            { numeroTarefa: '1210684', numAlteracao: 1, tipoAlteracao: TIPO_MODIFICACAO.MODIFIED }
                        ]
                    },
                    {
                        pathArtefato: 'package.json',
                        listaTarefa: [
                            { numeroTarefa: '0000000', numAlteracao: 1, tipoAlteracao: TIPO_MODIFICACAO.ADDED },
                            { numeroTarefa: '1199211', numAlteracao: 1, tipoAlteracao: TIPO_MODIFICACAO.MODIFIED },
                            { numeroTarefa: '1203082', numAlteracao: 2, tipoAlteracao: TIPO_MODIFICACAO.MODIFIED },
                            { numeroTarefa: '1203670', numAlteracao: 1, tipoAlteracao: TIPO_MODIFICACAO.MODIFIED },
                            { numeroTarefa: '1207175', numAlteracao: 2, tipoAlteracao: TIPO_MODIFICACAO.MODIFIED },
                            { numeroTarefa: '1210684', numAlteracao: 2, tipoAlteracao: TIPO_MODIFICACAO.MODIFIED }
                        ]
                    },
                    {
                        pathArtefato: 'Gruntfile.js',
                        listaTarefa: [
                            { numeroTarefa: '0000000', numAlteracao: 1, tipoAlteracao: TIPO_MODIFICACAO.ADDED },
                            { numeroTarefa: '1199211', numAlteracao: 1, tipoAlteracao: TIPO_MODIFICACAO.MODIFIED },
                            { numeroTarefa: '1203670', numAlteracao: 1, tipoAlteracao: TIPO_MODIFICACAO.MODIFIED },
                            { numeroTarefa: '1210684', numAlteracao: 1, tipoAlteracao: TIPO_MODIFICACAO.MODIFIED }
                        ]
                    },
                    {
                        pathArtefato: 'src/app/spas/imovel/xyzzys-pendentes/lista-xyzzys-pendentes-controllers.js',
                        listaTarefa: [
                            { numeroTarefa: '0000000', numAlteracao: 1, tipoAlteracao: TIPO_MODIFICACAO.ADDED },
                            { numeroTarefa: '1199211', numAlteracao: 2, tipoAlteracao: TIPO_MODIFICACAO.MODIFIED },
                            { numeroTarefa: '1203082', numAlteracao: 3, tipoAlteracao: TIPO_MODIFICACAO.MODIFIED },
                            { numeroTarefa: '1207175', numAlteracao: 3, tipoAlteracao: TIPO_MODIFICACAO.MODIFIED }
                        ]
                    },
                    {
                        pathArtefato: 'src/app/spas/imovel/documentos/lista-documentos-controllers.js',
                        listaTarefa: [
                            { numeroTarefa: '0000000', numAlteracao: 1, tipoAlteracao: TIPO_MODIFICACAO.ADDED },
                            { numeroTarefa: '1203670', numAlteracao: 4, tipoAlteracao: TIPO_MODIFICACAO.MODIFIED },
                            { numeroTarefa: '1210684', numAlteracao: 5, tipoAlteracao: TIPO_MODIFICACAO.MODIFIED }
                        ]
                    },
                    {
                        pathArtefato: 'src/app/spas/imovel/inclusao-ocupante-imovel/inclusao-ocupante-imovel.tpl.html',
                        listaTarefa: [
                            { numeroTarefa: '0000000', numAlteracao: 1, tipoAlteracao: TIPO_MODIFICACAO.ADDED },
                            { numeroTarefa: '1199211', numAlteracao: 2, tipoAlteracao: TIPO_MODIFICACAO.MODIFIED }
                        ]
                    },
                    {
                        pathArtefato: 'src/app/spas/imovel/xyzzys-pendentes/lista-xyzzys-pendentes.tpl.html',
                        listaTarefa: [
                            { numeroTarefa: '0000000', numAlteracao: 1, tipoAlteracao: TIPO_MODIFICACAO.ADDED },
                            { numeroTarefa: '1199211', numAlteracao: 4, tipoAlteracao: TIPO_MODIFICACAO.MODIFIED }
                        ]
                    },
                    {
                        pathArtefato: 'src/app/qux/qux-constantes.js',
                        listaTarefa: [
                            { numeroTarefa: '0000000', numAlteracao: 1, tipoAlteracao: TIPO_MODIFICACAO.ADDED },
                            { numeroTarefa: '1199211', numAlteracao: 2, tipoAlteracao: TIPO_MODIFICACAO.MODIFIED }
                        ]
                    },
                    {
                        pathArtefato: 'src/styles/qux.css',
                        listaTarefa: [
                            { numeroTarefa: '0000000', numAlteracao: 1, tipoAlteracao: TIPO_MODIFICACAO.ADDED },
                            { numeroTarefa: '1199211', numAlteracao: 1, tipoAlteracao: TIPO_MODIFICACAO.MODIFIED }
                        ]
                    },
                    {
                        pathArtefato: 'spec/inclusao-ocupante-imovel-controllers-spec.js',
                        listaTarefa: [
                            { numeroTarefa: '0000000', numAlteracao: 1, tipoAlteracao: TIPO_MODIFICACAO.ADDED },
                            { numeroTarefa: '1203082', numAlteracao: 2, tipoAlteracao: TIPO_MODIFICACAO.MODIFIED }
                        ]
                    },
                    {
                        pathArtefato: 'spec/lista-xyzzys-pendentes-controllers-spec.js',
                        listaTarefa: [
                            { numeroTarefa: '1203082', numAlteracao: 1, tipoAlteracao: TIPO_MODIFICACAO.ADDED }
                        ]
                    },
                    {
                        pathArtefato: 'src/app/spas/imovel/documentos/includes/tabela-documentosObrigatorios.tpl.html',
                        listaTarefa: [
                            { numeroTarefa: '0000000', numAlteracao: 1, tipoAlteracao: TIPO_MODIFICACAO.ADDED },
                            { numeroTarefa: '1203670', numAlteracao: 5, tipoAlteracao: TIPO_MODIFICACAO.MODIFIED }
                        ]
                    },
                    {
                        pathArtefato: 'src/app/spas/imovel/documentos/includes/tabela-documentos.tpl.html',
                        listaTarefa: [
                            { numeroTarefa: '0000000', numAlteracao: 1, tipoAlteracao: TIPO_MODIFICACAO.ADDED },
                            { numeroTarefa: '1203670', numAlteracao: 1, tipoAlteracao: TIPO_MODIFICACAO.MODIFIED }
                        ]
                    },
                    {
                        pathArtefato: 'src/app/spas/imovel/despacho-xyzzy/lista-garply-locacao-fase-cronograma-controller.js',
                        listaTarefa: [
                            { numeroTarefa: '0000000', numAlteracao: 1, tipoAlteracao: TIPO_MODIFICACAO.ADDED },
                            { numeroTarefa: '1207175', numAlteracao: 1, tipoAlteracao: TIPO_MODIFICACAO.MODIFIED }
                        ]
                    },
                    {
                        pathArtefato: 'src/app/spas/imovel/despacho-xyzzy/modal-lista-fornecedor/modal-detalha-credor/detalhe-credor-controller.js',
                        listaTarefa: [
                            { numeroTarefa: '0000000', numAlteracao: 1, tipoAlteracao: TIPO_MODIFICACAO.ADDED },
                            { numeroTarefa: '1207175', numAlteracao: 1, tipoAlteracao: TIPO_MODIFICACAO.MODIFIED }
                        ]
                    },
                    {
                        pathArtefato: 'src/app/spas/imovel/despacho-xyzzy/despacho-services.js',
                        listaTarefa: [
                            { numeroTarefa: '0000000', numAlteracao: 1, tipoAlteracao: TIPO_MODIFICACAO.ADDED },
                            { numeroTarefa: '1207175', numAlteracao: 1, tipoAlteracao: TIPO_MODIFICACAO.MODIFIED }
                        ]
                    },
                    {
                        pathArtefato: 'src/app/spas/imovel/despacho-xyzzy/modal-lista-fornecedor/lista-fornecedor-controllers.js',
                        listaTarefa: [
                            { numeroTarefa: '0000000', numAlteracao: 1, tipoAlteracao: TIPO_MODIFICACAO.ADDED },
                            { numeroTarefa: '1207175', numAlteracao: 1, tipoAlteracao: TIPO_MODIFICACAO.MODIFIED }
                        ]
                    },
                    {
                        pathArtefato: 'spec/lista-documentos-controllers-spec.js',
                        listaTarefa: [
                            { numeroTarefa: '0000000', numAlteracao: 1, tipoAlteracao: TIPO_MODIFICACAO.ADDED },
                            { numeroTarefa: '1210658', numAlteracao: 1, tipoAlteracao: TIPO_MODIFICACAO.MODIFIED }
                        ]
                    },
                ]
            }, {
                nomeProjeto: 'bar-api',
                listaArtefato: [{
                    pathArtefato: 'pom.xml',
                    listaTarefa: [
                        { numeroTarefa: '0000000', numAlteracao: 1, tipoAlteracao: TIPO_MODIFICACAO.ADDED },
                        { numeroTarefa: '1207175', numAlteracao: 1, tipoAlteracao: TIPO_MODIFICACAO.MODIFIED }
                    ]
                }]
            },
            {
                nomeProjeto: 'qux-api',
                listaArtefato: [{
                    pathArtefato: 'pom.xml',
                    listaTarefa: [
                        { numeroTarefa: '0000000', numAlteracao: 1, tipoAlteracao: TIPO_MODIFICACAO.ADDED },
                        { numeroTarefa: '1207175', numAlteracao: 1, tipoAlteracao: TIPO_MODIFICACAO.MODIFIED }
                    ]
                }]
            },
        ]

        await geradorUtilTest.criarEstrutura(listaEstrutura, autor)
    })

    it('test gerador async', async () => {

        const gerador = require('../lib/gerador')

        const params = new Param({
            autor: autor,
            task: ["1199211", "1203082", "1203670", "1207175", "1210684","1210658", "1212262", "1212444"],
            projeto: [
                geradorUtilTest.pathTest() + "/bar-estatico",
                geradorUtilTest.pathTest() + "/bar-api",
                geradorUtilTest.pathTest() + "/qux-estatico",
                geradorUtilTest.pathTest() + "/qux-api"
            ],
            mostrarDeletados: true,
            mostrarRenomeados: true,
            mostrarNumModificacao: true
        })

        params.mostrarCommitsLocais = true

        const lista = await gerador(params).gerarListaArtefato()

        testarLista(lista)
    })

    function testarLista(lista) {

        expect(lista).toHaveLength(13)

        expect(lista[0].listaNumTarefaSaida).toHaveLength(2)
        expect(lista[0].listaNumTarefaSaida).toEqual(expect.arrayContaining(['1207175', '1212444']))
        expect(lista[0].listaArtefatoSaida).toHaveLength(1)

        expect(lista[0].listaArtefatoSaida[0].tipoAlteracao).toBe(TIPO_MODIFICACAO.MODIFIED)
        expect(lista[0].listaArtefatoSaida[0].numeroAlteracao).toBe(2)
        expect(lista[0].listaArtefatoSaida[0].nomeArtefato).toMatch(/.*bar-estatico\/package.json$/g)

        expect(lista[1].listaNumTarefaSaida).toHaveLength(2)
        expect(lista[1].listaNumTarefaSaida).toEqual(expect.arrayContaining(['1203670', '1210684']))
        expect(lista[1].listaArtefatoSaida).toHaveLength(1)
        expect(lista[1].listaArtefatoSaida[0].tipoAlteracao).toBe(TIPO_MODIFICACAO.MODIFIED)
        expect(lista[1].listaArtefatoSaida[0].numeroAlteracao).toBe(2)
        expect(lista[1].listaArtefatoSaida[0].nomeArtefato).toMatch(/.*lista-documentos.tpl.html$/g)

        expect(lista[2].listaNumTarefaSaida).toHaveLength(5)
        expect(lista[2].listaNumTarefaSaida).toEqual(expect.arrayContaining(['1199211', '1203082', '1203670', '1207175', '1210684']))
        expect(lista[2].listaArtefatoSaida).toHaveLength(1)
        expect(lista[2].listaArtefatoSaida[0].tipoAlteracao).toBe(TIPO_MODIFICACAO.MODIFIED)
        expect(lista[2].listaArtefatoSaida[0].numeroAlteracao).toBe(8)
        expect(lista[2].listaArtefatoSaida[0].nomeArtefato).toMatch(/.*qux-estatico\/package.json$/g)

        expect(lista[3].listaNumTarefaSaida).toHaveLength(3)
        expect(lista[3].listaNumTarefaSaida).toEqual(expect.arrayContaining(['1199211', '1203670', '1210684']))
        expect(lista[3].listaArtefatoSaida).toHaveLength(1)
        expect(lista[3].listaArtefatoSaida[0].tipoAlteracao).toBe(TIPO_MODIFICACAO.MODIFIED)
        expect(lista[3].listaArtefatoSaida[0].numeroAlteracao).toBe(3)
        expect(lista[3].listaArtefatoSaida[0].nomeArtefato).toMatch(/.*qux-estatico\/Gruntfile.js$/g)

        expect(lista[4].listaNumTarefaSaida).toHaveLength(3)
        expect(lista[4].listaNumTarefaSaida).toEqual(expect.arrayContaining(['1199211', '1203082', '1207175']))
        expect(lista[4].listaArtefatoSaida).toHaveLength(1)
        expect(lista[4].listaArtefatoSaida[0].tipoAlteracao).toBe(TIPO_MODIFICACAO.MODIFIED)
        expect(lista[4].listaArtefatoSaida[0].numeroAlteracao).toBe(8)
        expect(lista[4].listaArtefatoSaida[0].nomeArtefato).toMatch(/.*lista-xyzzys-pendentes-controllers.js$/g)

        expect(lista[5].listaNumTarefaSaida).toHaveLength(2)
        expect(lista[5].listaNumTarefaSaida).toEqual(expect.arrayContaining(['1203670', '1210684']))
        expect(lista[5].listaArtefatoSaida).toHaveLength(1)
        expect(lista[5].listaArtefatoSaida[0].tipoAlteracao).toBe(TIPO_MODIFICACAO.MODIFIED)
        expect(lista[5].listaArtefatoSaida[0].numeroAlteracao).toBe(9)
        expect(lista[5].listaArtefatoSaida[0].nomeArtefato).toMatch(/.*lista-documentos-controllers.js$/g)

        expect(lista[6].listaNumTarefaSaida).toHaveLength(1)
        expect(lista[6].listaNumTarefaSaida).toEqual(expect.arrayContaining(['1199211']))
        expect(lista[6].listaArtefatoSaida).toHaveLength(4)

        expect(lista[6].listaArtefatoSaida[0].tipoAlteracao).toBe(TIPO_MODIFICACAO.MODIFIED)
        expect(lista[6].listaArtefatoSaida[0].numeroAlteracao).toBe(2)
        expect(lista[6].listaArtefatoSaida[0].nomeArtefato).toMatch(/.*inclusao-ocupante-imovel.tpl.html$/g)

        expect(lista[6].listaArtefatoSaida[1].tipoAlteracao).toBe(TIPO_MODIFICACAO.MODIFIED)
        expect(lista[6].listaArtefatoSaida[1].numeroAlteracao).toBe(4)
        expect(lista[6].listaArtefatoSaida[1].nomeArtefato).toMatch(/.*lista-xyzzys-pendentes.tpl.html$/g)

        expect(lista[6].listaArtefatoSaida[2].tipoAlteracao).toBe(TIPO_MODIFICACAO.MODIFIED)
        expect(lista[6].listaArtefatoSaida[2].numeroAlteracao).toBe(2)
        expect(lista[6].listaArtefatoSaida[2].nomeArtefato).toMatch(/.*qux-constantes.js$/g)

        expect(lista[6].listaArtefatoSaida[3].tipoAlteracao).toBe(TIPO_MODIFICACAO.MODIFIED)
        expect(lista[6].listaArtefatoSaida[3].numeroAlteracao).toBe(1)
        expect(lista[6].listaArtefatoSaida[3].nomeArtefato).toMatch(/.*qux.css$/g)

        expect(lista[7].listaNumTarefaSaida).toHaveLength(1)
        expect(lista[7].listaNumTarefaSaida).toEqual(expect.arrayContaining(['1203082']))
        expect(lista[7].listaArtefatoSaida).toHaveLength(1)

        expect(lista[7].listaArtefatoSaida[0].tipoAlteracao).toBe(TIPO_MODIFICACAO.ADDED)
        expect(lista[7].listaArtefatoSaida[0].numeroAlteracao).toBe(1)
        expect(lista[7].listaArtefatoSaida[0].nomeArtefato).toMatch(/.*lista-xyzzys-pendentes-controllers-spec.js$/g)

        expect(lista[8].listaNumTarefaSaida).toHaveLength(1)
        expect(lista[8].listaNumTarefaSaida).toEqual(expect.arrayContaining(['1203082']))
        expect(lista[8].listaArtefatoSaida).toHaveLength(1)

        expect(lista[8].listaArtefatoSaida[0].tipoAlteracao).toBe(TIPO_MODIFICACAO.MODIFIED)
        expect(lista[8].listaArtefatoSaida[0].numeroAlteracao).toBe(2)
        expect(lista[8].listaArtefatoSaida[0].nomeArtefato).toMatch(/.*inclusao-ocupante-imovel-controllers-spec.js$/g)

        expect(lista[9].listaNumTarefaSaida).toHaveLength(1)
        expect(lista[9].listaNumTarefaSaida).toEqual(expect.arrayContaining(['1203670']))
        expect(lista[9].listaArtefatoSaida).toHaveLength(2)

        expect(lista[9].listaArtefatoSaida[0].tipoAlteracao).toBe(TIPO_MODIFICACAO.MODIFIED)
        expect(lista[9].listaArtefatoSaida[0].numeroAlteracao).toBe(5)
        expect(lista[9].listaArtefatoSaida[0].nomeArtefato).toMatch(/.*tabela-documentosObrigatorios.tpl.html$/g)

        expect(lista[9].listaArtefatoSaida[1].tipoAlteracao).toBe(TIPO_MODIFICACAO.MODIFIED)
        expect(lista[9].listaArtefatoSaida[1].numeroAlteracao).toBe(1)
        expect(lista[9].listaArtefatoSaida[1].nomeArtefato).toMatch(/.*tabela-documentos.tpl.html$/g)

        expect(lista[10].listaNumTarefaSaida).toHaveLength(1)
        expect(lista[10].listaNumTarefaSaida).toEqual(expect.arrayContaining(['1207175']))
        expect(lista[10].listaArtefatoSaida).toHaveLength(6)

        expect(lista[10].listaArtefatoSaida[0].tipoAlteracao).toBe(TIPO_MODIFICACAO.MODIFIED)
        expect(lista[10].listaArtefatoSaida[0].numeroAlteracao).toBe(1)
        expect(lista[10].listaArtefatoSaida[0].nomeArtefato).toMatch(/.*bar-api\/pom.xml$/g)

        expect(lista[10].listaArtefatoSaida[1].tipoAlteracao).toBe(TIPO_MODIFICACAO.MODIFIED)
        expect(lista[10].listaArtefatoSaida[1].numeroAlteracao).toBe(1)
        expect(lista[10].listaArtefatoSaida[1].nomeArtefato).toMatch(/.*qux-api\/pom.xml$/g)

        expect(lista[10].listaArtefatoSaida[2].tipoAlteracao).toBe(TIPO_MODIFICACAO.MODIFIED)
        expect(lista[10].listaArtefatoSaida[2].numeroAlteracao).toBe(1)
        expect(lista[10].listaArtefatoSaida[2].nomeArtefato).toMatch(/.*lista-garply-locacao-fase-cronograma-controller.js$/g)

        expect(lista[10].listaArtefatoSaida[3].tipoAlteracao).toBe(TIPO_MODIFICACAO.MODIFIED)
        expect(lista[10].listaArtefatoSaida[3].numeroAlteracao).toBe(1)
        expect(lista[10].listaArtefatoSaida[3].nomeArtefato).toMatch(/.*detalhe-credor-controller.js$/g)

        expect(lista[10].listaArtefatoSaida[4].tipoAlteracao).toBe(TIPO_MODIFICACAO.MODIFIED)
        expect(lista[10].listaArtefatoSaida[4].numeroAlteracao).toBe(1)
        expect(lista[10].listaArtefatoSaida[4].nomeArtefato).toMatch(/.*despacho-services.js$/g)

        expect(lista[10].listaArtefatoSaida[5].tipoAlteracao).toBe(TIPO_MODIFICACAO.MODIFIED)
        expect(lista[10].listaArtefatoSaida[5].numeroAlteracao).toBe(1)
        expect(lista[10].listaArtefatoSaida[5].nomeArtefato).toMatch(/.*lista-fornecedor-controllers.js$/g)

        expect(lista[11].listaNumTarefaSaida).toHaveLength(1)
        expect(lista[11].listaNumTarefaSaida).toEqual(expect.arrayContaining(['1210658']))
        expect(lista[11].listaArtefatoSaida).toHaveLength(1)

        expect(lista[11].listaArtefatoSaida[0].tipoAlteracao).toBe(TIPO_MODIFICACAO.MODIFIED)
        expect(lista[11].listaArtefatoSaida[0].numeroAlteracao).toBe(1)
        expect(lista[11].listaArtefatoSaida[0].nomeArtefato).toMatch(/.*lista-documentos-controllers-spec.js$/g)

        expect(lista[12].listaNumTarefaSaida).toHaveLength(1)
        expect(lista[12].listaNumTarefaSaida).toEqual(expect.arrayContaining(['1212444']))
        expect(lista[12].listaArtefatoSaida).toHaveLength(2)

        expect(lista[12].listaArtefatoSaida[0].tipoAlteracao).toBe(TIPO_MODIFICACAO.MODIFIED)
        expect(lista[12].listaArtefatoSaida[0].numeroAlteracao).toBe(1)
        expect(lista[12].listaArtefatoSaida[0].nomeArtefato).toMatch(/.*detalha-cronograma-parcela.tpl.html$/g)

        expect(lista[12].listaArtefatoSaida[1].tipoAlteracao).toBe(TIPO_MODIFICACAO.MODIFIED)
        expect(lista[12].listaArtefatoSaida[1].numeroAlteracao).toBe(1)
        expect(lista[12].listaArtefatoSaida[1].nomeArtefato).toMatch(/.*detalha-cronograma-parcela-controllers.js$/g)
    }
})