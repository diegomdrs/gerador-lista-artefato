const gerador = require('../lib/gerador')
const Param = require('../models/param')
const geradorUtilTest = require('./gerador-util-test')

let listaEstrutura = []

describe('test foo', () => {

    beforeEach(async () => {

        listaEstrutura = [
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
                },
                {
                    pathArtefato: 'src/app/spas/contrato/consulta/detalhaContrato/cronogramaParcelas/detalha-cronograma-parcela.tpl.html',
                    listaTarefa: [
                        { numTarefa: '0000000', numAlteracao: 1, tipoAlteracao: 'A' },
                        { numTarefa: '1212444', numAlteracao: 1, tipoAlteracao: 'M' }
                    ]
                },
                {
                    pathArtefato: 'src/app/spas/contrato/consulta/detalhaContrato/cronogramaParcelas/detalha-cronograma-parcela-controllers.js',
                    listaTarefa: [
                        { numTarefa: '0000000', numAlteracao: 1, tipoAlteracao: 'A' },
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
                    },
                    {
                        pathArtefato: 'spec/inclusao-ocupante-imovel-controllers-spec.js',
                        listaTarefa: [
                            { numTarefa: '0000000', numAlteracao: 1, tipoAlteracao: 'A' },
                            { numTarefa: '1203082', numAlteracao: 2, tipoAlteracao: 'M' }
                        ]
                    },
                    {
                        pathArtefato: 'spec/lista-pagamentos-pendentes-controllers-spec.js',
                        listaTarefa: [
                            { numTarefa: '1203082', numAlteracao: 1, tipoAlteracao: 'A' }
                        ]
                    },
                    {
                        pathArtefato: 'src/app/spas/imovel/documentos/includes/tabela-documentosObrigatorios.tpl.html',
                        listaTarefa: [
                            { numTarefa: '0000000', numAlteracao: 1, tipoAlteracao: 'A' },
                            { numTarefa: '1203670', numAlteracao: 5, tipoAlteracao: 'M' }
                        ]
                    },
                    {
                        pathArtefato: 'src/app/spas/imovel/documentos/includes/tabela-documentos.tpl.html',
                        listaTarefa: [
                            { numTarefa: '0000000', numAlteracao: 1, tipoAlteracao: 'A' },
                            { numTarefa: '1203670', numAlteracao: 1, tipoAlteracao: 'M' }
                        ]
                    },
                    {
                        pathArtefato: 'src/app/spas/imovel/despacho-pagamento/lista-contrato-locacao-fase-cronograma-controller.js',
                        listaTarefa: [
                            { numTarefa: '0000000', numAlteracao: 1, tipoAlteracao: 'A' },
                            { numTarefa: '1207175', numAlteracao: 1, tipoAlteracao: 'M' }
                        ]
                    },
                    {
                        pathArtefato: 'src/app/spas/imovel/despacho-pagamento/modal-lista-fornecedor/modal-detalha-credor/detalhe-credor-controller.js',
                        listaTarefa: [
                            { numTarefa: '0000000', numAlteracao: 1, tipoAlteracao: 'A' },
                            { numTarefa: '1207175', numAlteracao: 1, tipoAlteracao: 'M' }
                        ]
                    },
                    {
                        pathArtefato: 'src/app/spas/imovel/despacho-pagamento/despacho-services.js',
                        listaTarefa: [
                            { numTarefa: '0000000', numAlteracao: 1, tipoAlteracao: 'A' },
                            { numTarefa: '1207175', numAlteracao: 1, tipoAlteracao: 'M' }
                        ]
                    },
                    {
                        pathArtefato: 'src/app/spas/imovel/despacho-pagamento/modal-lista-fornecedor/lista-fornecedor-controllers.js',
                        listaTarefa: [
                            { numTarefa: '0000000', numAlteracao: 1, tipoAlteracao: 'A' },
                            { numTarefa: '1207175', numAlteracao: 1, tipoAlteracao: 'M' }
                        ]
                    },
                    {
                        pathArtefato: 'spec/lista-documentos-controllers-spec.js',
                        listaTarefa: [
                            { numTarefa: '0000000', numAlteracao: 1, tipoAlteracao: 'A' },
                            { numTarefa: '1210658', numAlteracao: 1, tipoAlteracao: 'M' }
                        ]
                    },
                ]
            }, {
                repo: {},
                nomeProjeto: 'apc-api',
                listaArtefato: [{
                    pathArtefato: 'pom.xml',
                    listaTarefa: [
                        { numTarefa: '0000000', numAlteracao: 1, tipoAlteracao: 'A' },
                        { numTarefa: '1207175', numAlteracao: 1, tipoAlteracao: 'M' }
                    ]
                }]
            },
            {
                repo: {},
                nomeProjeto: 'crm-patrimonio-api',
                listaArtefato: [{
                    pathArtefato: 'pom.xml',
                    listaTarefa: [
                        { numTarefa: '0000000', numAlteracao: 1, tipoAlteracao: 'A' },
                        { numTarefa: '1207175', numAlteracao: 1, tipoAlteracao: 'M' }
                    ]
                }]
            },
        ]

    })

    it('test', async () => {

        await geradorUtilTest.criarEstrutura(listaEstrutura)

        const params = new Param({
            diretorio: geradorUtilTest.pathTest(),
            autor: "fulano",
            projeto: ["apc-estatico", "apc-api", "crm-patrimonio-estatico", "crm-patrimonio-api"],
            task: ["1199211", "1203082", "1203670", "1207175", "1210684",
                "1210658", "1212262", "1212444"]
        })

        const lista = await gerador(params).gerarListaArtefato()

        expect(lista[0].listaNumTarefaSaida).toHaveLength(2)
        expect(lista[0].listaArtefatoSaida[0].numeroAlteracao).toBe(2)
        expect(lista[0].listaArtefatoSaida[0].tipoAlteracao).toBe('M')

        expect(lista[1].listaNumTarefaSaida).toHaveLength(2)
        expect(lista[1].listaArtefatoSaida[0].numeroAlteracao).toBe(2)
        expect(lista[1].listaArtefatoSaida[0].tipoAlteracao).toBe('M')

        expect(lista[2].listaNumTarefaSaida).toHaveLength(5)
        expect(lista[2].listaArtefatoSaida[0].numeroAlteracao).toBe(8)
        expect(lista[2].listaArtefatoSaida[0].tipoAlteracao).toBe('M')

        expect(lista[3].listaNumTarefaSaida).toHaveLength(3)
        expect(lista[3].listaArtefatoSaida[0].numeroAlteracao).toBe(3)
        expect(lista[3].listaArtefatoSaida[0].tipoAlteracao).toBe('M')

        expect(lista[4].listaNumTarefaSaida).toHaveLength(3)
        expect(lista[4].listaArtefatoSaida[0].numeroAlteracao).toBe(8)
        expect(lista[4].listaArtefatoSaida[0].tipoAlteracao).toBe('M')

        expect(lista[5].listaNumTarefaSaida).toHaveLength(2)
        expect(lista[5].listaArtefatoSaida[0].numeroAlteracao).toBe(9)
        expect(lista[5].listaArtefatoSaida[0].tipoAlteracao).toBe('M')

        expect(lista[6].listaNumTarefaSaida).toHaveLength(1)
        expect(lista[6].listaArtefatoSaida[0].numeroAlteracao).toBe(2)
        expect(lista[6].listaArtefatoSaida[1].numeroAlteracao).toBe(4)
        expect(lista[6].listaArtefatoSaida[2].numeroAlteracao).toBe(2)
        expect(lista[6].listaArtefatoSaida[3].numeroAlteracao).toBe(1)

        expect(lista[7].listaNumTarefaSaida).toHaveLength(1)
        expect(lista[7].listaArtefatoSaida[0].numeroAlteracao).toBe(2)
        expect(lista[7].listaArtefatoSaida[0].tipoAlteracao).toBe('M')
        expect(lista[7].listaArtefatoSaida[1].numeroAlteracao).toBe(1)
        expect(lista[7].listaArtefatoSaida[1].tipoAlteracao).toBe('A')

        expect(lista[8].listaNumTarefaSaida).toHaveLength(1)
        expect(lista[8].listaArtefatoSaida[0].numeroAlteracao).toBe(5)
        expect(lista[8].listaArtefatoSaida[0].tipoAlteracao).toBe('M')
        expect(lista[8].listaArtefatoSaida[1].numeroAlteracao).toBe(1)
        expect(lista[8].listaArtefatoSaida[1].tipoAlteracao).toBe('M')

        expect(lista[9].listaNumTarefaSaida).toHaveLength(1)
        expect(lista[9].listaArtefatoSaida[0].numeroAlteracao).toBe(1)
        expect(lista[9].listaArtefatoSaida[0].tipoAlteracao).toBe('M')
        expect(lista[9].listaArtefatoSaida[1].numeroAlteracao).toBe(1)
        expect(lista[9].listaArtefatoSaida[1].tipoAlteracao).toBe('M')
        expect(lista[9].listaArtefatoSaida[2].numeroAlteracao).toBe(1)
        expect(lista[9].listaArtefatoSaida[2].tipoAlteracao).toBe('M')
        expect(lista[9].listaArtefatoSaida[3].numeroAlteracao).toBe(1)
        expect(lista[9].listaArtefatoSaida[3].tipoAlteracao).toBe('M')
        expect(lista[9].listaArtefatoSaida[4].numeroAlteracao).toBe(1)
        expect(lista[9].listaArtefatoSaida[4].tipoAlteracao).toBe('M')
        expect(lista[9].listaArtefatoSaida[5].numeroAlteracao).toBe(1)
        expect(lista[9].listaArtefatoSaida[5].tipoAlteracao).toBe('M')

        expect(lista[10].listaNumTarefaSaida).toHaveLength(1)
        expect(lista[10].listaArtefatoSaida[0].numeroAlteracao).toBe(1)
        expect(lista[10].listaArtefatoSaida[0].tipoAlteracao).toBe('M')

        expect(lista[11].listaNumTarefaSaida).toHaveLength(1)
        expect(lista[11].listaArtefatoSaida[0].numeroAlteracao).toBe(1)
        expect(lista[11].listaArtefatoSaida[0].tipoAlteracao).toBe('M')
        expect(lista[11].listaArtefatoSaida[1].numeroAlteracao).toBe(1)
        expect(lista[11].listaArtefatoSaida[1].tipoAlteracao).toBe('M')
    })

    afterEach(() => {

        geradorUtilTest.removerDiretorioTest()
    })
})