const Param = require('../models/param')
const geradorUtilTest = require('./gerador-util-test')

const autor = 'fulano'

const TIPO_MODIFICACAO = require('../lib/constants').TIPO_MODIFICACAO

describe('test comando fulano', () => {

    beforeAll(async () => {

        geradorUtilTest.removerDiretorioTest()

        jest.setTimeout(10000)

        const listaEstrutura = [
            {
                repo: {},
                nomeProjeto: 'bar-api',
                listaArtefato: [{
                    pathArtefato: 'src/main/java/br/com/foo/bar/api/v1/waldo/resource/BazResource.java',
                    listaTarefa: [
                        { numeroTarefa: '0000000', numAlteracao: 1, tipoAlteracao: TIPO_MODIFICACAO.ADDED },
                        { numeroTarefa: '1155478', numAlteracao: 4, tipoAlteracao: TIPO_MODIFICACAO.MODIFIED },
                        { numeroTarefa: '1150152', numAlteracao: 5, tipoAlteracao: TIPO_MODIFICACAO.MODIFIED }
                    ]
                }, {
                    pathArtefato: 'src/test/java/br/com/foo/bar/api/v1/resources/test/BazResourceTest.java',
                    listaTarefa: [
                        { numeroTarefa: '0000000', numAlteracao: 1, tipoAlteracao: TIPO_MODIFICACAO.ADDED },
                        { numeroTarefa: '1155478', numAlteracao: 1, tipoAlteracao: TIPO_MODIFICACAO.MODIFIED },
                        { numeroTarefa: '1150152', numAlteracao: 1, tipoAlteracao: TIPO_MODIFICACAO.MODIFIED }
                    ]
                },
                {
                    pathArtefato: 'pom.xml',
                    listaTarefa: [
                        { numeroTarefa: '0000000', numAlteracao: 1, tipoAlteracao: TIPO_MODIFICACAO.ADDED },
                        { numeroTarefa: '1172414', numAlteracao: 2, tipoAlteracao: TIPO_MODIFICACAO.MODIFIED },
                        { numeroTarefa: '1168800', numAlteracao: 2, tipoAlteracao: TIPO_MODIFICACAO.MODIFIED },
                        { numeroTarefa: '1163642', numAlteracao: 2, tipoAlteracao: TIPO_MODIFICACAO.MODIFIED },
                        { numeroTarefa: '1155478', numAlteracao: 2, tipoAlteracao: TIPO_MODIFICACAO.MODIFIED },
                        { numeroTarefa: '1150152', numAlteracao: 2, tipoAlteracao: TIPO_MODIFICACAO.MODIFIED }
                    ]
                },
                {
                    pathArtefato: 'src/main/java/br/com/foo/bar/infra/SwaggerBootstrap.java',
                    listaTarefa: [
                        { numeroTarefa: '0000000', numAlteracao: 1, tipoAlteracao: TIPO_MODIFICACAO.ADDED },
                        { numeroTarefa: '1172414', numAlteracao: 1, tipoAlteracao: TIPO_MODIFICACAO.DELETED }
                    ]
                },
                {
                    pathArtefato: 'src/test/java/br/com/foo/bar/api/v1/outros/test/SwaggerBootstrapTest.java',
                    listaTarefa: [
                        { numeroTarefa: '0000000', numAlteracao: 1, tipoAlteracao: TIPO_MODIFICACAO.ADDED },
                        { numeroTarefa: '1172414', numAlteracao: 1, tipoAlteracao: TIPO_MODIFICACAO.DELETED }
                    ]
                },
                {
                    pathArtefato: 'src/main/webapp/WEB-INF/web.xml',
                    listaTarefa: [
                        { numeroTarefa: '0000000', numAlteracao: 1, tipoAlteracao: TIPO_MODIFICACAO.ADDED },
                        { numeroTarefa: '1172414', numAlteracao: 2, tipoAlteracao: TIPO_MODIFICACAO.MODIFIED }
                    ]
                },
                {
                    pathArtefato: 'src/main/java/br/com/foo/bar/api/v1/waldo/gateway/GatewayRegistrarCredorContrato.java',
                    listaTarefa: [
                        { numeroTarefa: '0000000', numAlteracao: 1, tipoAlteracao: TIPO_MODIFICACAO.ADDED },
                        { numeroTarefa: '1155478', numAlteracao: 1, tipoAlteracao: TIPO_MODIFICACAO.MODIFIED }
                    ]
                },
                {
                    pathArtefato: 'src/main/java/br/com/foo/bar/api/v1/waldo/gateway/GatewayListarParametroFormaCorge.java',
                    listaTarefa: [
                        { numeroTarefa: '0000000', numAlteracao: 1, tipoAlteracao: TIPO_MODIFICACAO.ADDED },
                        { numeroTarefa: '1155478', numAlteracao: 1, tipoAlteracao: TIPO_MODIFICACAO.DELETED }
                    ]
                },
                {
                    pathArtefato: 'src/main/java/br/com/foo/bar/api/v1/waldo/resources/ContratoResource.java',
                    listaTarefa: [
                        { numeroTarefa: '0000000', numAlteracao: 1, tipoAlteracao: TIPO_MODIFICACAO.ADDED },
                        { numeroTarefa: '1150152', numAlteracao: 2, tipoAlteracao: TIPO_MODIFICACAO.MODIFIED }
                    ]
                },
                {
                    pathArtefato: 'src/main/java/br/com/foo/bar/api/v1/waldo/gateway/GatewayListarWaldoThudBarFlobBaz.java',
                    listaTarefa: [
                        { numeroTarefa: '0000000', numAlteracao: 1, tipoAlteracao: TIPO_MODIFICACAO.ADDED },
                        { numeroTarefa: '1150152', numAlteracao: 1, tipoAlteracao: TIPO_MODIFICACAO.MODIFIED }
                    ]
                },
                {
                    pathArtefato: {
                        origem: 'src/main/java/br/com/foo/bar/api/v1/waldo/gateway/GatewayListarWaldoThudBarFlobBaz.java',
                        destino: 'src/main/java/br/com/foo/bar/api/v1/waldo/gateway/GatewayListarWaldoThudBarBaz.java'
                    },
                    listaTarefa: [
                        { numeroTarefa: '0000000', numAlteracao: 1, tipoAlteracao: TIPO_MODIFICACAO.ADDED },
                        { numeroTarefa: { origem: '0000000', destino: '1150152' }, numAlteracao: 1, tipoAlteracao: TIPO_MODIFICACAO.RENAMED }
                    ]
                }
                ]
            }, {
                repo: {},
                nomeProjeto: 'bar-estatico',
                listaArtefato: [{
                    pathArtefato: 'src/app/spas/waldo/consulta/detalha-bar/detalha-waldo.tpl.html',
                    listaTarefa: [
                        { numeroTarefa: '0000000', numAlteracao: 1, tipoAlteracao: TIPO_MODIFICACAO.ADDED },
                        { numeroTarefa: '1168815', numAlteracao: 1, tipoAlteracao: TIPO_MODIFICACAO.MODIFIED },
                        { numeroTarefa: '1150152', numAlteracao: 1, tipoAlteracao: TIPO_MODIFICACAO.MODIFIED }
                    ]
                },
                {
                    pathArtefato: 'src/app/spas/waldo/consulta/detalha-bar/waldo/lista-waldo.tpl.html',
                    listaTarefa: [
                        { numeroTarefa: '0000000', numAlteracao: 1, tipoAlteracao: TIPO_MODIFICACAO.ADDED },
                        { numeroTarefa: '1168815', numAlteracao: 4, tipoAlteracao: TIPO_MODIFICACAO.MODIFIED },
                        { numeroTarefa: '1168800', numAlteracao: 4, tipoAlteracao: TIPO_MODIFICACAO.MODIFIED },
                        { numeroTarefa: '1167319', numAlteracao: 3, tipoAlteracao: TIPO_MODIFICACAO.MODIFIED },
                        { numeroTarefa: '1163642', numAlteracao: 4, tipoAlteracao: TIPO_MODIFICACAO.MODIFIED },
                        { numeroTarefa: '1155478', numAlteracao: 4, tipoAlteracao: TIPO_MODIFICACAO.MODIFIED },
                        { numeroTarefa: '1150152', numAlteracao: 4, tipoAlteracao: TIPO_MODIFICACAO.MODIFIED }
                    ]
                },
                {
                    pathArtefato: 'src/app/spas/waldo/consulta/detalha-bar/waldo/modal-dados-baz/manter-waldo.tpl.html',
                    listaTarefa: [
                        { numeroTarefa: '0000000', numAlteracao: 1, tipoAlteracao: TIPO_MODIFICACAO.ADDED },
                        { numeroTarefa: '1168800', numAlteracao: 7, tipoAlteracao: TIPO_MODIFICACAO.MODIFIED },
                        { numeroTarefa: '1167319', numAlteracao: 7, tipoAlteracao: TIPO_MODIFICACAO.MODIFIED },
                        { numeroTarefa: '1163642', numAlteracao: 7, tipoAlteracao: TIPO_MODIFICACAO.MODIFIED },
                        { numeroTarefa: '1155478', numAlteracao: 7, tipoAlteracao: TIPO_MODIFICACAO.MODIFIED }
                    ]
                },
                {
                    pathArtefato: 'src/app/spas/waldo/consulta/detalha-bar/abas-detalha-waldo.html',
                    listaTarefa: [
                        { numeroTarefa: '0000000', numAlteracao: 1, tipoAlteracao: TIPO_MODIFICACAO.ADDED },
                        { numeroTarefa: '1168815', numAlteracao: 1, tipoAlteracao: TIPO_MODIFICACAO.MODIFIED },
                        { numeroTarefa: '1150152', numAlteracao: 1, tipoAlteracao: TIPO_MODIFICACAO.MODIFIED }
                    ]
                },
                {
                    pathArtefato: 'src/app/spas/waldo/waldo.app.html',
                    listaTarefa: [
                        { numeroTarefa: '0000000', numAlteracao: 1, tipoAlteracao: TIPO_MODIFICACAO.ADDED },
                        { numeroTarefa: '1155478', numAlteracao: 1, tipoAlteracao: TIPO_MODIFICACAO.MODIFIED },
                        { numeroTarefa: '1150152', numAlteracao: 1, tipoAlteracao: TIPO_MODIFICACAO.MODIFIED }
                    ]
                },
                {
                    pathArtefato: 'package.json',
                    listaTarefa: [
                        { numeroTarefa: '0000000', numAlteracao: 1, tipoAlteracao: TIPO_MODIFICACAO.ADDED },
                        { numeroTarefa: '1168800', numAlteracao: 2, tipoAlteracao: TIPO_MODIFICACAO.MODIFIED },
                        { numeroTarefa: '1163642', numAlteracao: 1, tipoAlteracao: TIPO_MODIFICACAO.MODIFIED },
                        { numeroTarefa: '1155478', numAlteracao: 2, tipoAlteracao: TIPO_MODIFICACAO.MODIFIED },
                        { numeroTarefa: '1150152', numAlteracao: 2, tipoAlteracao: TIPO_MODIFICACAO.MODIFIED }
                    ]
                },
                {
                    pathArtefato: 'spec/app/spas/waldo/consulta/detalha-bar/waldo/lista-waldo-controllers-spec.js',
                    listaTarefa: [
                        { numeroTarefa: '0000000', numAlteracao: 1, tipoAlteracao: TIPO_MODIFICACAO.ADDED },
                        { numeroTarefa: '1168800', numAlteracao: 1, tipoAlteracao: TIPO_MODIFICACAO.MODIFIED },
                        { numeroTarefa: '1163642', numAlteracao: 1, tipoAlteracao: TIPO_MODIFICACAO.MODIFIED },
                        { numeroTarefa: '1155478', numAlteracao: 1, tipoAlteracao: TIPO_MODIFICACAO.MODIFIED }
                    ]
                },
                {
                    pathArtefato: 'Gruntfile.js',
                    listaTarefa: [
                        { numeroTarefa: '0000000', numAlteracao: 1, tipoAlteracao: TIPO_MODIFICACAO.ADDED },
                        { numeroTarefa: '1155478', numAlteracao: 1, tipoAlteracao: TIPO_MODIFICACAO.MODIFIED },
                        { numeroTarefa: '1150152', numAlteracao: 1, tipoAlteracao: TIPO_MODIFICACAO.MODIFIED }
                    ]
                },
                {
                    pathArtefato: 'src/app/spas/waldo/waldo-app.js',
                    listaTarefa: [
                        { numeroTarefa: '0000000', numAlteracao: 1, tipoAlteracao: TIPO_MODIFICACAO.ADDED },
                        { numeroTarefa: '1168815', numAlteracao: 1, tipoAlteracao: TIPO_MODIFICACAO.MODIFIED },
                        { numeroTarefa: '1155478', numAlteracao: 1, tipoAlteracao: TIPO_MODIFICACAO.MODIFIED },
                        { numeroTarefa: '1150152', numAlteracao: 1, tipoAlteracao: TIPO_MODIFICACAO.MODIFIED }
                    ]
                },
                {
                    pathArtefato: 'src/app/spas/waldo/consulta/detalha-bar/waldo/modal-dados-baz/manter-waldo-controller.js',
                    listaTarefa: [
                        { numeroTarefa: '0000000', numAlteracao: 1, tipoAlteracao: TIPO_MODIFICACAO.ADDED },
                        { numeroTarefa: '1168800', numAlteracao: 7, tipoAlteracao: TIPO_MODIFICACAO.MODIFIED },
                        { numeroTarefa: '1167319', numAlteracao: 9, tipoAlteracao: TIPO_MODIFICACAO.MODIFIED },
                        { numeroTarefa: '1163642', numAlteracao: 8, tipoAlteracao: TIPO_MODIFICACAO.MODIFIED },
                        { numeroTarefa: '1155478', numAlteracao: 9, tipoAlteracao: TIPO_MODIFICACAO.MODIFIED }
                    ]
                },
                {
                    pathArtefato: 'src/app/spas/waldo/waldo-services.js',
                    listaTarefa: [
                        { numeroTarefa: '0000000', numAlteracao: 1, tipoAlteracao: TIPO_MODIFICACAO.ADDED },
                        { numeroTarefa: '1163642', numAlteracao: 3, tipoAlteracao: TIPO_MODIFICACAO.MODIFIED },
                        { numeroTarefa: '1155478', numAlteracao: 3, tipoAlteracao: TIPO_MODIFICACAO.MODIFIED },
                        { numeroTarefa: '1150152', numAlteracao: 3, tipoAlteracao: TIPO_MODIFICACAO.MODIFIED }
                    ]
                },
                {
                    pathArtefato: 'src/app/spas/waldo/consulta/detalha-bar/waldo/lista-waldo-controllers.js',
                    listaTarefa: [
                        { numeroTarefa: '0000000', numAlteracao: 1, tipoAlteracao: TIPO_MODIFICACAO.ADDED },
                        { numeroTarefa: '1168800', numAlteracao: 5, tipoAlteracao: TIPO_MODIFICACAO.MODIFIED },
                        { numeroTarefa: '1167319', numAlteracao: 6, tipoAlteracao: TIPO_MODIFICACAO.MODIFIED },
                        { numeroTarefa: '1163642', numAlteracao: 5, tipoAlteracao: TIPO_MODIFICACAO.MODIFIED },
                        { numeroTarefa: '1155478', numAlteracao: 6, tipoAlteracao: TIPO_MODIFICACAO.MODIFIED },
                        { numeroTarefa: '1150152', numAlteracao: 5, tipoAlteracao: TIPO_MODIFICACAO.MODIFIED }
                    ]
                },
                {
                    pathArtefato: 'src/app/spas/pagamento/garply-corge/modal-detalha-wibble-waldo/detalha-wibble-waldo.tpl.html',
                    listaTarefa: [
                        { numeroTarefa: '0000000', numAlteracao: 1, tipoAlteracao: TIPO_MODIFICACAO.ADDED },
                        { numeroTarefa: '1168800', numAlteracao: 1, tipoAlteracao: TIPO_MODIFICACAO.MODIFIED }
                    ]
                },
                {
                    pathArtefato: 'src/app/scripts/bar-constantes.js',
                    listaTarefa: [
                        { numeroTarefa: '0000000', numAlteracao: 1, tipoAlteracao: TIPO_MODIFICACAO.ADDED },
                        { numeroTarefa: '1168800', numAlteracao: 1, tipoAlteracao: TIPO_MODIFICACAO.MODIFIED }
                    ]
                },
                {
                    pathArtefato: 'src/app/scripts/bar-utils.js',
                    listaTarefa: [
                        { numeroTarefa: '0000000', numAlteracao: 1, tipoAlteracao: TIPO_MODIFICACAO.ADDED },
                        { numeroTarefa: '1155478', numAlteracao: 3, tipoAlteracao: TIPO_MODIFICACAO.MODIFIED }
                    ]
                },
                {
                    pathArtefato: 'src/app/styles/bar.css',
                    listaTarefa: [
                        { numeroTarefa: '0000000', numAlteracao: 1, tipoAlteracao: TIPO_MODIFICACAO.ADDED },
                        { numeroTarefa: '1150152', numAlteracao: 1, tipoAlteracao: TIPO_MODIFICACAO.MODIFIED }
                    ]
                }]
            },
            {
                repo: {},
                nomeProjeto: 'qux-estatico',
                listaArtefato: [
                    {
                        pathArtefato: 'package.json',
                        listaTarefa: [
                            { numeroTarefa: '0000000', numAlteracao: 1, tipoAlteracao: TIPO_MODIFICACAO.ADDED },
                            { numeroTarefa: '1168815', numAlteracao: 4, tipoAlteracao: TIPO_MODIFICACAO.MODIFIED }
                        ]
                    },
                    {
                        pathArtefato: 'Gruntfile.js',
                        listaTarefa: [
                            { numeroTarefa: '0000000', numAlteracao: 1, tipoAlteracao: TIPO_MODIFICACAO.ADDED },
                            { numeroTarefa: '1163642', numAlteracao: 1, tipoAlteracao: TIPO_MODIFICACAO.MODIFIED }
                        ]
                    }]
            },
            {
                repo: {},
                nomeProjeto: 'qux-api',
                listaArtefato: [
                    {
                        pathArtefato: 'src/main/java/br/com/foo/qux/api/v1/garply-corge/resource/garply-corgeResource.java',
                        listaTarefa: [
                            { numeroTarefa: '0000000', numAlteracao: 1, tipoAlteracao: TIPO_MODIFICACAO.ADDED },
                            { numeroTarefa: '1161422', numAlteracao: 1, tipoAlteracao: TIPO_MODIFICACAO.MODIFIED }
                        ]
                    },
                    {
                        pathArtefato: 'src/main/java/br/com/foo/qux/api/v1/garply-corge/gateway/GatewayListarBarFaseWibbleFinanceiro.java',
                        listaTarefa: [
                            { numeroTarefa: '0000000', numAlteracao: 1, tipoAlteracao: TIPO_MODIFICACAO.ADDED },
                            { numeroTarefa: '1161422', numAlteracao: 1, tipoAlteracao: TIPO_MODIFICACAO.MODIFIED }
                        ]
                    },
                    {
                        pathArtefato: 'src/test/java/br/com/foo/qux/api/v1/resources/garply-corgeResourceTest.java',
                        listaTarefa: [
                            { numeroTarefa: '0000000', numAlteracao: 1, tipoAlteracao: TIPO_MODIFICACAO.ADDED },
                            { numeroTarefa: '1161422', numAlteracao: 1, tipoAlteracao: TIPO_MODIFICACAO.MODIFIED }
                        ]
                    },
                    {
                        pathArtefato: 'src/test/java/br/com/foo/qux/api/v1/gateway/GatewayListarBarWibbleFaseTest.java',
                        listaTarefa: [
                            { numeroTarefa: '0000000', numAlteracao: 1, tipoAlteracao: TIPO_MODIFICACAO.ADDED },
                            { numeroTarefa: '1161422', numAlteracao: 1, tipoAlteracao: TIPO_MODIFICACAO.MODIFIED }
                        ]
                    },
                    {
                        pathArtefato: 'pom.xml',
                        listaTarefa: [
                            { numeroTarefa: '0000000', numAlteracao: 1, tipoAlteracao: TIPO_MODIFICACAO.ADDED },
                            { numeroTarefa: '1161422', numAlteracao: 2, tipoAlteracao: TIPO_MODIFICACAO.MODIFIED }
                        ]
                    }]
            },

        ]

        await geradorUtilTest.criarEstrutura(listaEstrutura, autor)
    })

    it('test gerador', async () => {

        const gerador = require('../lib/gerador')

        const params = new Param({
            autor: autor,
            task: ["1168815", "1172414", "1168800", "1167319", "1163642", "1155478", "1150152", "1161422"],
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

        expect(lista).toHaveLength(25)

        expect(lista[0].listaNumTarefaSaida).toHaveLength(2)
        expect(lista[0].listaNumTarefaSaida).toEqual(expect.arrayContaining(['1150152', '1155478']))
        expect(lista[0].listaArtefatoSaida).toHaveLength(1)
        expect(lista[0].listaArtefatoSaida[0].tipoAlteracao).toBe(TIPO_MODIFICACAO.MODIFIED)
        expect(lista[0].listaArtefatoSaida[0].numeroAlteracao).toBe(9)
        expect(lista[0].listaArtefatoSaida[0].nomeArtefato).toMatch(/.*BazResource.java$/g)

        expect(lista[2].listaNumTarefaSaida).toHaveLength(5)
        expect(lista[2].listaNumTarefaSaida).toEqual(expect.arrayContaining(['1172414', '1168800', '1163642', '1155478', '1150152']))
        expect(lista[2].listaArtefatoSaida).toHaveLength(1)
        expect(lista[2].listaArtefatoSaida[0].tipoAlteracao).toBe(TIPO_MODIFICACAO.MODIFIED)
        expect(lista[2].listaArtefatoSaida[0].numeroAlteracao).toBe(10)
        expect(lista[2].listaArtefatoSaida[0].nomeArtefato).toMatch(/.*pom.xml$/g)

        expect(lista[4].listaNumTarefaSaida).toHaveLength(6)
        expect(lista[4].listaNumTarefaSaida).toEqual(expect.arrayContaining(['1168815', '1168800', '1167319', '1163642', '1155478', '1150152']))
        expect(lista[4].listaArtefatoSaida).toHaveLength(1)
        expect(lista[4].listaArtefatoSaida[0].tipoAlteracao).toBe(TIPO_MODIFICACAO.MODIFIED)
        expect(lista[4].listaArtefatoSaida[0].numeroAlteracao).toBe(23)
        expect(lista[4].listaArtefatoSaida[0].nomeArtefato).toMatch(/.*lista-waldo.tpl.html$/g)

        expect(lista[12].listaNumTarefaSaida).toHaveLength(4)
        expect(lista[12].listaNumTarefaSaida).toEqual(expect.arrayContaining(['1168800', '1167319', '1163642', '1155478']))
        expect(lista[12].listaArtefatoSaida).toHaveLength(1)
        expect(lista[12].listaArtefatoSaida[0].tipoAlteracao).toBe(TIPO_MODIFICACAO.MODIFIED)
        expect(lista[12].listaArtefatoSaida[0].numeroAlteracao).toBe(33)
        expect(lista[12].listaArtefatoSaida[0].nomeArtefato).toMatch(/.*manter-waldo-controller.js$/g)

        expect(lista[16].listaNumTarefaSaida).toHaveLength(1)
        expect(lista[16].listaNumTarefaSaida).toEqual(expect.arrayContaining(['1172414']))
        expect(lista[16].listaArtefatoSaida).toHaveLength(1)

        expect(lista[16].listaArtefatoSaida[0].tipoAlteracao).toBe(TIPO_MODIFICACAO.MODIFIED)
        expect(lista[16].listaArtefatoSaida[0].numeroAlteracao).toBe(2)
        expect(lista[16].listaArtefatoSaida[0].nomeArtefato).toMatch(/.*web.xml$/g)

        expect(lista[17].listaNumTarefaSaida).toHaveLength(1)
        expect(lista[17].listaNumTarefaSaida).toEqual(expect.arrayContaining(['1172414']))
        expect(lista[17].listaArtefatoSaida).toHaveLength(2)

        expect(lista[17].listaArtefatoSaida[0].tipoAlteracao).toBe(TIPO_MODIFICACAO.DELETED)
        expect(lista[17].listaArtefatoSaida[0].numeroAlteracao).toBe(1)
        expect(lista[17].listaArtefatoSaida[0].nomeArtefato).toMatch(/.*SwaggerBootstrap.java$/g)

        expect(lista[17].listaArtefatoSaida[1].tipoAlteracao).toBe(TIPO_MODIFICACAO.DELETED)
        expect(lista[17].listaArtefatoSaida[1].numeroAlteracao).toBe(1)
        expect(lista[17].listaArtefatoSaida[1].nomeArtefato).toMatch(/.*SwaggerBootstrapTest.java$/g)

        expect(lista[20].listaNumTarefaSaida).toHaveLength(1)
        expect(lista[20].listaNumTarefaSaida).toEqual(expect.arrayContaining(['1155478']))
        expect(lista[20].listaArtefatoSaida).toHaveLength(2)

        expect(lista[20].listaArtefatoSaida[0].tipoAlteracao).toBe(TIPO_MODIFICACAO.MODIFIED)
        expect(lista[20].listaArtefatoSaida[0].numeroAlteracao).toBe(1)
        expect(lista[20].listaArtefatoSaida[0].nomeArtefato).toMatch(/.*GatewayRegistrarCredorContrato.java$/g)

        expect(lista[20].listaArtefatoSaida[1].tipoAlteracao).toBe(TIPO_MODIFICACAO.MODIFIED)
        expect(lista[20].listaArtefatoSaida[1].numeroAlteracao).toBe(3)
        expect(lista[20].listaArtefatoSaida[1].nomeArtefato).toMatch(/.*bar-utils.js$/g)

        expect(lista[21].listaNumTarefaSaida).toHaveLength(1)
        expect(lista[21].listaNumTarefaSaida).toEqual(expect.arrayContaining(['1155478']))
        expect(lista[21].listaArtefatoSaida).toHaveLength(1)

        expect(lista[21].listaArtefatoSaida[0].tipoAlteracao).toBe(TIPO_MODIFICACAO.DELETED)
        expect(lista[21].listaArtefatoSaida[0].numeroAlteracao).toBe(1)
        expect(lista[21].listaArtefatoSaida[0].nomeArtefato).toMatch(/.*GatewayListarParametroFormaCorge.java$/g)

        expect(lista[22].listaNumTarefaSaida).toHaveLength(1)
        expect(lista[22].listaNumTarefaSaida).toEqual(expect.arrayContaining(['1150152']))
        expect(lista[22].listaArtefatoSaida).toHaveLength(3)

        expect(lista[22].listaArtefatoSaida[0].tipoAlteracao).toBe(TIPO_MODIFICACAO.MODIFIED)
        expect(lista[22].listaArtefatoSaida[0].numeroAlteracao).toBe(2)
        expect(lista[22].listaArtefatoSaida[0].nomeArtefato).toMatch(/.*ContratoResource.java$/g)

        expect(lista[22].listaArtefatoSaida[1].tipoAlteracao).toBe(TIPO_MODIFICACAO.MODIFIED)
        expect(lista[22].listaArtefatoSaida[1].numeroAlteracao).toBe(1)
        expect(lista[22].listaArtefatoSaida[1].nomeArtefato).toMatch(/.*GatewayListarWaldoThudBarBaz.java$/g)

        expect(lista[22].listaArtefatoSaida[2].tipoAlteracao).toBe(TIPO_MODIFICACAO.MODIFIED)
        expect(lista[22].listaArtefatoSaida[2].numeroAlteracao).toBe(1)
        expect(lista[22].listaArtefatoSaida[2].nomeArtefato).toMatch(/.*bar.css$/g)

        expect(lista[23].listaNumTarefaSaida).toHaveLength(1)
        expect(lista[23].listaNumTarefaSaida).toEqual(expect.arrayContaining(['1150152']))
        expect(lista[23].listaArtefatoSaida).toHaveLength(1)

        expect(lista[23].listaArtefatoSaida[0].tipoAlteracao).toBe(TIPO_MODIFICACAO.RENAMED)
        expect(lista[23].listaArtefatoSaida[0].numeroAlteracao).toBe(1)
        expect(lista[23].listaArtefatoSaida[0].nomeArtefato).toMatch(/.*GatewayListarWaldoThudBarBaz.java$/g)
        expect(lista[23].listaArtefatoSaida[0].nomeAntigoArtefato).toMatch(/.*GatewayListarWaldoThudBarFlobBaz.java$/g)
        expect(lista[23].listaArtefatoSaida[0].nomeNovoArtefato).toMatch(/.*GatewayListarWaldoThudBarBaz.java$/g)
    }
})