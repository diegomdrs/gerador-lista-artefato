const Param = require('../models/param')
const geradorUtilTest = require('./gerador-util-test')

let params = {}

describe('test comando fernando', () => {

    beforeAll(async () => {

        geradorUtilTest.removerDiretorioTest()

        jest.setTimeout(10000)

        params = new Param({
            autor: "fulano",
            projeto: ["apc-estatico", "apc-api", "crm-patrimonio-estatico", "crm-patrimonio-api"],
            task: ["1199211", "1203082", "1203670", "1207175", "1210684",
                "1210658", "1212262", "1212444"]
        })

        params.diretorio = geradorUtilTest.pathTest(),

        listaEstrutura = [
            {
                nomeProjeto: 'apc-estatico',
                listaArtefato: [{
                    pathArtefato: 'package.json',
                    listaTarefa: [
                        { numeroTarefa: '0000000', numAlteracao: 1, tipoAlteracao: 'A' },
                        { numeroTarefa: '1207175', numAlteracao: 1, tipoAlteracao: 'M' },
                        { numeroTarefa: '1212444', numAlteracao: 1, tipoAlteracao: 'M' }
                    ]
                },
                {
                    pathArtefato: 'src/app/spas/contrato/consulta/detalhaContrato/cronogramaParcelas/detalha-cronograma-parcela.tpl.html',
                    listaTarefa: [
                        { numeroTarefa: '0000000', numAlteracao: 1, tipoAlteracao: 'A' },
                        { numeroTarefa: '1212444', numAlteracao: 1, tipoAlteracao: 'M' }
                    ]
                },
                {
                    pathArtefato: 'src/app/spas/contrato/consulta/detalhaContrato/cronogramaParcelas/detalha-cronograma-parcela-controllers.js',
                    listaTarefa: [
                        { numeroTarefa: '0000000', numAlteracao: 1, tipoAlteracao: 'A' },
                        { numeroTarefa: '1212444', numAlteracao: 1, tipoAlteracao: 'M' }
                    ]
                }]
            },
            {
                nomeProjeto: 'crm-patrimonio-estatico',
                listaArtefato: [
                    {
                        pathArtefato: 'src/app/spas/imovel/documentos/lista-documentos.tpl.html',
                        listaTarefa: [
                            { numeroTarefa: '0000000', numAlteracao: 1, tipoAlteracao: 'A' },
                            { numeroTarefa: '1203670', numAlteracao: 1, tipoAlteracao: 'M' },
                            { numeroTarefa: '1210684', numAlteracao: 1, tipoAlteracao: 'M' }
                        ]
                    },
                    {
                        pathArtefato: 'package.json',
                        listaTarefa: [
                            { numeroTarefa: '0000000', numAlteracao: 1, tipoAlteracao: 'A' },
                            { numeroTarefa: '1199211', numAlteracao: 1, tipoAlteracao: 'M' },
                            { numeroTarefa: '1203082', numAlteracao: 2, tipoAlteracao: 'M' },
                            { numeroTarefa: '1203670', numAlteracao: 1, tipoAlteracao: 'M' },
                            { numeroTarefa: '1207175', numAlteracao: 2, tipoAlteracao: 'M' },
                            { numeroTarefa: '1210684', numAlteracao: 2, tipoAlteracao: 'M' }
                        ]
                    },
                    {
                        pathArtefato: 'Gruntfile.js',
                        listaTarefa: [
                            { numeroTarefa: '0000000', numAlteracao: 1, tipoAlteracao: 'A' },
                            { numeroTarefa: '1199211', numAlteracao: 1, tipoAlteracao: 'M' },
                            { numeroTarefa: '1203670', numAlteracao: 1, tipoAlteracao: 'M' },
                            { numeroTarefa: '1210684', numAlteracao: 1, tipoAlteracao: 'M' }
                        ]
                    },
                    {
                        pathArtefato: 'src/app/spas/imovel/pagamentos-pendentes/lista-pagamentos-pendentes-controllers.js',
                        listaTarefa: [
                            { numeroTarefa: '0000000', numAlteracao: 1, tipoAlteracao: 'A' },
                            { numeroTarefa: '1199211', numAlteracao: 2, tipoAlteracao: 'M' },
                            { numeroTarefa: '1203082', numAlteracao: 3, tipoAlteracao: 'M' },
                            { numeroTarefa: '1207175', numAlteracao: 3, tipoAlteracao: 'M' }
                        ]
                    },
                    {
                        pathArtefato: 'src/app/spas/imovel/documentos/lista-documentos-controllers.js',
                        listaTarefa: [
                            { numeroTarefa: '0000000', numAlteracao: 1, tipoAlteracao: 'A' },
                            { numeroTarefa: '1203670', numAlteracao: 4, tipoAlteracao: 'M' },
                            { numeroTarefa: '1210684', numAlteracao: 5, tipoAlteracao: 'M' }
                        ]
                    },
                    {
                        pathArtefato: 'src/app/spas/imovel/inclusao-ocupante-imovel/inclusao-ocupante-imovel.tpl.html',
                        listaTarefa: [
                            { numeroTarefa: '0000000', numAlteracao: 1, tipoAlteracao: 'A' },
                            { numeroTarefa: '1199211', numAlteracao: 2, tipoAlteracao: 'M' }
                        ]
                    },
                    {
                        pathArtefato: 'src/app/spas/imovel/pagamentos-pendentes/lista-pagamentos-pendentes.tpl.html',
                        listaTarefa: [
                            { numeroTarefa: '0000000', numAlteracao: 1, tipoAlteracao: 'A' },
                            { numeroTarefa: '1199211', numAlteracao: 4, tipoAlteracao: 'M' }
                        ]
                    },
                    {
                        pathArtefato: 'src/app/crm/crm-constantes.js',
                        listaTarefa: [
                            { numeroTarefa: '0000000', numAlteracao: 1, tipoAlteracao: 'A' },
                            { numeroTarefa: '1199211', numAlteracao: 2, tipoAlteracao: 'M' }
                        ]
                    },
                    {
                        pathArtefato: 'src/styles/crm.css',
                        listaTarefa: [
                            { numeroTarefa: '0000000', numAlteracao: 1, tipoAlteracao: 'A' },
                            { numeroTarefa: '1199211', numAlteracao: 1, tipoAlteracao: 'M' }
                        ]
                    },
                    {
                        pathArtefato: 'spec/inclusao-ocupante-imovel-controllers-spec.js',
                        listaTarefa: [
                            { numeroTarefa: '0000000', numAlteracao: 1, tipoAlteracao: 'A' },
                            { numeroTarefa: '1203082', numAlteracao: 2, tipoAlteracao: 'M' }
                        ]
                    },
                    {
                        pathArtefato: 'spec/lista-pagamentos-pendentes-controllers-spec.js',
                        listaTarefa: [
                            { numeroTarefa: '1203082', numAlteracao: 1, tipoAlteracao: 'A' }
                        ]
                    },
                    {
                        pathArtefato: 'src/app/spas/imovel/documentos/includes/tabela-documentosObrigatorios.tpl.html',
                        listaTarefa: [
                            { numeroTarefa: '0000000', numAlteracao: 1, tipoAlteracao: 'A' },
                            { numeroTarefa: '1203670', numAlteracao: 5, tipoAlteracao: 'M' }
                        ]
                    },
                    {
                        pathArtefato: 'src/app/spas/imovel/documentos/includes/tabela-documentos.tpl.html',
                        listaTarefa: [
                            { numeroTarefa: '0000000', numAlteracao: 1, tipoAlteracao: 'A' },
                            { numeroTarefa: '1203670', numAlteracao: 1, tipoAlteracao: 'M' }
                        ]
                    },
                    {
                        pathArtefato: 'src/app/spas/imovel/despacho-pagamento/lista-contrato-locacao-fase-cronograma-controller.js',
                        listaTarefa: [
                            { numeroTarefa: '0000000', numAlteracao: 1, tipoAlteracao: 'A' },
                            { numeroTarefa: '1207175', numAlteracao: 1, tipoAlteracao: 'M' }
                        ]
                    },
                    {
                        pathArtefato: 'src/app/spas/imovel/despacho-pagamento/modal-lista-fornecedor/modal-detalha-credor/detalhe-credor-controller.js',
                        listaTarefa: [
                            { numeroTarefa: '0000000', numAlteracao: 1, tipoAlteracao: 'A' },
                            { numeroTarefa: '1207175', numAlteracao: 1, tipoAlteracao: 'M' }
                        ]
                    },
                    {
                        pathArtefato: 'src/app/spas/imovel/despacho-pagamento/despacho-services.js',
                        listaTarefa: [
                            { numeroTarefa: '0000000', numAlteracao: 1, tipoAlteracao: 'A' },
                            { numeroTarefa: '1207175', numAlteracao: 1, tipoAlteracao: 'M' }
                        ]
                    },
                    {
                        pathArtefato: 'src/app/spas/imovel/despacho-pagamento/modal-lista-fornecedor/lista-fornecedor-controllers.js',
                        listaTarefa: [
                            { numeroTarefa: '0000000', numAlteracao: 1, tipoAlteracao: 'A' },
                            { numeroTarefa: '1207175', numAlteracao: 1, tipoAlteracao: 'M' }
                        ]
                    },
                    {
                        pathArtefato: 'spec/lista-documentos-controllers-spec.js',
                        listaTarefa: [
                            { numeroTarefa: '0000000', numAlteracao: 1, tipoAlteracao: 'A' },
                            { numeroTarefa: '1210658', numAlteracao: 1, tipoAlteracao: 'M' }
                        ]
                    },
                ]
            }, {
                nomeProjeto: 'apc-api',
                listaArtefato: [{
                    pathArtefato: 'pom.xml',
                    listaTarefa: [
                        { numeroTarefa: '0000000', numAlteracao: 1, tipoAlteracao: 'A' },
                        { numeroTarefa: '1207175', numAlteracao: 1, tipoAlteracao: 'M' }
                    ]
                }]
            },
            {
                nomeProjeto: 'crm-patrimonio-api',
                listaArtefato: [{
                    pathArtefato: 'pom.xml',
                    listaTarefa: [
                        { numeroTarefa: '0000000', numAlteracao: 1, tipoAlteracao: 'A' },
                        { numeroTarefa: '1207175', numAlteracao: 1, tipoAlteracao: 'M' }
                    ]
                }]
            },
        ]

        await geradorUtilTest.criarEstrutura(listaEstrutura)
    })

    it('test gerador sync master', async () => {

        const gerador = require('../lib/gerador-sync-master')

        const lista = await gerador(params).gerarListaArtefato()

        testarLista(lista)
    })

    it('test gerador async', async () => {

        const params = new Param({
            autor: "fulano",
            projeto: [
                geradorUtilTest.pathTest() + "/apc-estatico", 
                geradorUtilTest.pathTest() + "/apc-api", 
                geradorUtilTest.pathTest() + "/crm-patrimonio-estatico", 
                geradorUtilTest.pathTest() + "/crm-patrimonio-api"
            ],
            task: ["1199211", "1203082", "1203670", "1207175", "1210684",
                "1210658", "1212262", "1212444"]
        })

        const gerador = require('../lib/gerador')

        const lista = await gerador(params).gerarListaArtefato()

        testarLista(lista)
    })

    function testarLista(lista) {

        expect(lista).toHaveLength(12)

        expect(lista[0].listaNumTarefaSaida).toHaveLength(2)
        expect(lista[0].listaNumTarefaSaida).toEqual(expect.arrayContaining(['1207175', '1212444']))
        expect(lista[0].listaArtefatoSaida).toHaveLength(1)
        expect(lista[0].listaArtefatoSaida[0].tipoAlteracao).toBe('M')
        expect(lista[0].listaArtefatoSaida[0].numeroAlteracao).toBe(2)
        expect(lista[0].listaArtefatoSaida[0].nomeArtefato).toMatch(/.*apc-estatico\/package.json$/g)

        expect(lista[1].listaNumTarefaSaida).toHaveLength(2)
        expect(lista[1].listaNumTarefaSaida).toEqual(expect.arrayContaining(['1203670', '1210684']))
        expect(lista[1].listaArtefatoSaida).toHaveLength(1)
        expect(lista[1].listaArtefatoSaida[0].tipoAlteracao).toBe('M')
        expect(lista[1].listaArtefatoSaida[0].numeroAlteracao).toBe(2)
        expect(lista[1].listaArtefatoSaida[0].nomeArtefato).toMatch(/.*lista-documentos.tpl.html$/g)

        expect(lista[2].listaNumTarefaSaida).toHaveLength(5)
        expect(lista[2].listaNumTarefaSaida).toEqual(expect.arrayContaining(['1199211', '1203082', '1203670', '1207175', '1210684']))
        expect(lista[2].listaArtefatoSaida).toHaveLength(1)
        expect(lista[2].listaArtefatoSaida[0].tipoAlteracao).toBe('M')
        expect(lista[2].listaArtefatoSaida[0].numeroAlteracao).toBe(8)
        expect(lista[2].listaArtefatoSaida[0].nomeArtefato).toMatch(/.*crm-patrimonio-estatico\/package.json$/g)

        expect(lista[3].listaNumTarefaSaida).toHaveLength(3)
        expect(lista[3].listaNumTarefaSaida).toEqual(expect.arrayContaining(['1199211', '1203670', '1210684']))
        expect(lista[3].listaArtefatoSaida).toHaveLength(1)
        expect(lista[3].listaArtefatoSaida[0].tipoAlteracao).toBe('M')
        expect(lista[3].listaArtefatoSaida[0].numeroAlteracao).toBe(3)
        expect(lista[3].listaArtefatoSaida[0].nomeArtefato).toMatch(/.*crm-patrimonio-estatico\/Gruntfile.js$/g)

        expect(lista[4].listaNumTarefaSaida).toHaveLength(3)
        expect(lista[4].listaNumTarefaSaida).toEqual(expect.arrayContaining(['1199211', '1203082', '1207175']))
        expect(lista[4].listaArtefatoSaida).toHaveLength(1)
        expect(lista[4].listaArtefatoSaida[0].tipoAlteracao).toBe('M')
        expect(lista[4].listaArtefatoSaida[0].numeroAlteracao).toBe(8)
        expect(lista[4].listaArtefatoSaida[0].nomeArtefato).toMatch(/.*lista-pagamentos-pendentes-controllers.js$/g)

        expect(lista[5].listaNumTarefaSaida).toHaveLength(2)
        expect(lista[5].listaNumTarefaSaida).toEqual(expect.arrayContaining(['1203670', '1210684']))
        expect(lista[5].listaArtefatoSaida).toHaveLength(1)
        expect(lista[5].listaArtefatoSaida[0].tipoAlteracao).toBe('M')
        expect(lista[5].listaArtefatoSaida[0].numeroAlteracao).toBe(9)
        expect(lista[5].listaArtefatoSaida[0].nomeArtefato).toMatch(/.*lista-documentos-controllers.js$/g)

        expect(lista[6].listaNumTarefaSaida).toHaveLength(1)
        expect(lista[6].listaNumTarefaSaida).toEqual(expect.arrayContaining(['1199211']))
        expect(lista[6].listaArtefatoSaida).toHaveLength(4)

        expect(lista[6].listaArtefatoSaida[0].tipoAlteracao).toBe('M')
        expect(lista[6].listaArtefatoSaida[0].numeroAlteracao).toBe(2)
        expect(lista[6].listaArtefatoSaida[0].nomeArtefato).toMatch(/.*inclusao-ocupante-imovel.tpl.html$/g)

        expect(lista[6].listaArtefatoSaida[1].tipoAlteracao).toBe('M')
        expect(lista[6].listaArtefatoSaida[1].numeroAlteracao).toBe(4)
        expect(lista[6].listaArtefatoSaida[1].nomeArtefato).toMatch(/.*lista-pagamentos-pendentes.tpl.html$/g)

        expect(lista[6].listaArtefatoSaida[2].tipoAlteracao).toBe('M')
        expect(lista[6].listaArtefatoSaida[2].numeroAlteracao).toBe(2)
        expect(lista[6].listaArtefatoSaida[2].nomeArtefato).toMatch(/.*crm-constantes.js$/g)
        
        expect(lista[6].listaArtefatoSaida[3].tipoAlteracao).toBe('M')
        expect(lista[6].listaArtefatoSaida[3].numeroAlteracao).toBe(1)
        expect(lista[6].listaArtefatoSaida[3].nomeArtefato).toMatch(/.*crm.css$/g)        

        expect(lista[7].listaNumTarefaSaida).toHaveLength(1)
        expect(lista[7].listaNumTarefaSaida).toEqual(expect.arrayContaining(['1203082']))
        expect(lista[7].listaArtefatoSaida).toHaveLength(2)

        expect(lista[7].listaArtefatoSaida[0].tipoAlteracao).toBe('M')
        expect(lista[7].listaArtefatoSaida[0].numeroAlteracao).toBe(2)
        expect(lista[7].listaArtefatoSaida[0].nomeArtefato).toMatch(/.*inclusao-ocupante-imovel-controllers-spec.js$/g)

        expect(lista[7].listaArtefatoSaida[1].tipoAlteracao).toBe('A')
        expect(lista[7].listaArtefatoSaida[1].numeroAlteracao).toBe(1)
        expect(lista[7].listaArtefatoSaida[1].nomeArtefato).toMatch(/.*lista-pagamentos-pendentes-controllers-spec.js$/g)

        expect(lista[8].listaNumTarefaSaida).toHaveLength(1)
        expect(lista[8].listaNumTarefaSaida).toEqual(expect.arrayContaining(['1203670']))
        expect(lista[8].listaArtefatoSaida).toHaveLength(2)

        expect(lista[8].listaArtefatoSaida[0].tipoAlteracao).toBe('M')
        expect(lista[8].listaArtefatoSaida[0].numeroAlteracao).toBe(5)
        expect(lista[8].listaArtefatoSaida[0].nomeArtefato).toMatch(/.*tabela-documentosObrigatorios.tpl.html$/g)

        expect(lista[8].listaArtefatoSaida[1].tipoAlteracao).toBe('M')
        expect(lista[8].listaArtefatoSaida[1].numeroAlteracao).toBe(1)
        expect(lista[8].listaArtefatoSaida[1].nomeArtefato).toMatch(/.*tabela-documentos.tpl.html$/g)

        expect(lista[9].listaNumTarefaSaida).toHaveLength(1)
        expect(lista[9].listaNumTarefaSaida).toEqual(expect.arrayContaining(['1207175']))
        expect(lista[9].listaArtefatoSaida).toHaveLength(6)

        expect(lista[9].listaArtefatoSaida[0].tipoAlteracao).toBe('M')
        expect(lista[9].listaArtefatoSaida[0].numeroAlteracao).toBe(1)
        expect(lista[9].listaArtefatoSaida[0].nomeArtefato).toMatch(/.*apc-api\/pom.xml$/g)

        expect(lista[9].listaArtefatoSaida[1].tipoAlteracao).toBe('M')
        expect(lista[9].listaArtefatoSaida[1].numeroAlteracao).toBe(1)
        expect(lista[9].listaArtefatoSaida[1].nomeArtefato).toMatch(/.*crm-patrimonio-api\/pom.xml$/g)

        expect(lista[9].listaArtefatoSaida[2].tipoAlteracao).toBe('M')
        expect(lista[9].listaArtefatoSaida[2].numeroAlteracao).toBe(1)
        expect(lista[9].listaArtefatoSaida[2].nomeArtefato).toMatch(/.*lista-contrato-locacao-fase-cronograma-controller.js$/g)

        expect(lista[9].listaArtefatoSaida[3].tipoAlteracao).toBe('M')
        expect(lista[9].listaArtefatoSaida[3].numeroAlteracao).toBe(1)
        expect(lista[9].listaArtefatoSaida[3].nomeArtefato).toMatch(/.*detalhe-credor-controller.js$/g)

        expect(lista[9].listaArtefatoSaida[4].tipoAlteracao).toBe('M')
        expect(lista[9].listaArtefatoSaida[4].numeroAlteracao).toBe(1)
        expect(lista[9].listaArtefatoSaida[4].nomeArtefato).toMatch(/.*despacho-services.js$/g) 
        
        expect(lista[9].listaArtefatoSaida[5].tipoAlteracao).toBe('M')
        expect(lista[9].listaArtefatoSaida[5].numeroAlteracao).toBe(1)
        expect(lista[9].listaArtefatoSaida[5].nomeArtefato).toMatch(/.*lista-fornecedor-controllers.js$/g)          

        expect(lista[10].listaNumTarefaSaida).toHaveLength(1)
        expect(lista[10].listaNumTarefaSaida).toEqual(expect.arrayContaining(['1210658']))
        expect(lista[10].listaArtefatoSaida).toHaveLength(1)

        expect(lista[10].listaArtefatoSaida[0].tipoAlteracao).toBe('M')
        expect(lista[10].listaArtefatoSaida[0].numeroAlteracao).toBe(1)
        expect(lista[10].listaArtefatoSaida[0].nomeArtefato).toMatch(/.*lista-documentos-controllers-spec.js$/g)

        expect(lista[11].listaNumTarefaSaida).toHaveLength(1)
        expect(lista[11].listaNumTarefaSaida).toEqual(expect.arrayContaining(['1212444']))
        expect(lista[11].listaArtefatoSaida).toHaveLength(2)

        expect(lista[11].listaArtefatoSaida[0].tipoAlteracao).toBe('M')
        expect(lista[11].listaArtefatoSaida[0].numeroAlteracao).toBe(1)
        expect(lista[11].listaArtefatoSaida[0].nomeArtefato).toMatch(/.*detalha-cronograma-parcela.tpl.html$/g)

        expect(lista[11].listaArtefatoSaida[1].tipoAlteracao).toBe('M')
        expect(lista[11].listaArtefatoSaida[1].numeroAlteracao).toBe(1)
        expect(lista[11].listaArtefatoSaida[1].nomeArtefato).toMatch(/.*detalha-cronograma-parcela-controllers.js$/g)        
    }
})