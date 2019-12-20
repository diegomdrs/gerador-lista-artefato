const gerador = require('../lib/gerador')
const Param = require('../models/param')
const geradorUtilTest = require('./gerador-util-test')

let listaEstrutura = []

describe('test foo', () => {

    beforeEach(async () => {

        listaEstrutura = [
            {
                repo: {},
                nomeProjeto: 'apc-api',
                listaArtefato: [{
                    pathArtefato: 'src/main/java/br/com/bb/apc/api/v1/fornecedor/resource/FornecedorResource.java',
                    listaTarefa: [
                        { numTarefa: '0000000', numAlteracao: 1, tipoAlteracao: 'A' },
                        { numTarefa: '1155478', numAlteracao: 4, tipoAlteracao: 'M' },
                        { numTarefa: '1150152', numAlteracao: 5, tipoAlteracao: 'M' }
                    ]
                }, {
                    pathArtefato: 'src/test/java/br/com/bb/apc/api/v1/resources/test/FornecedorResourceTest.java',
                    listaTarefa: [
                        { numTarefa: '0000000', numAlteracao: 1, tipoAlteracao: 'A' },
                        { numTarefa: '1155478', numAlteracao: 1, tipoAlteracao: 'M' },
                        { numTarefa: '1150152', numAlteracao: 1, tipoAlteracao: 'M' }
                    ]
                },
                {
                    pathArtefato: 'pom.xml',
                    listaTarefa: [
                        { numTarefa: '0000000', numAlteracao: 1, tipoAlteracao: 'A' },
                        { numTarefa: '1172414', numAlteracao: 2, tipoAlteracao: 'M' },
                        { numTarefa: '1168800', numAlteracao: 2, tipoAlteracao: 'M' },
                        { numTarefa: '1163642', numAlteracao: 2, tipoAlteracao: 'M' },
                        { numTarefa: '1155478', numAlteracao: 2, tipoAlteracao: 'M' },
                        { numTarefa: '1150152', numAlteracao: 2, tipoAlteracao: 'M' }
                    ]
                },
                {
                    pathArtefato: 'src/main/java/br/com/bb/apc/infra/SwaggerBootstrap.java',
                    listaTarefa: [
                        { numTarefa: '0000000', numAlteracao: 1, tipoAlteracao: 'A' },
                        { numTarefa: '1172414', numAlteracao: 1, tipoAlteracao: 'D' }
                    ]
                },
                {
                    pathArtefato: 'src/test/java/br/com/bb/apc/api/v1/outros/test/SwaggerBootstrapTest.java',
                    listaTarefa: [
                        { numTarefa: '0000000', numAlteracao: 1, tipoAlteracao: 'A' },
                        { numTarefa: '1172414', numAlteracao: 1, tipoAlteracao: 'D' }
                    ]
                },
                {
                    pathArtefato: 'src/main/webapp/WEB-INF/web.xml',
                    listaTarefa: [
                        { numTarefa: '0000000', numAlteracao: 1, tipoAlteracao: 'A' },
                        { numTarefa: '1172414', numAlteracao: 2, tipoAlteracao: 'M' }
                    ]
                },
                {
                    pathArtefato: 'src/main/java/br/com/bb/apc/api/v1/fornecedor/gateway/GatewayRegistrarCredorContratoArrendamento.java',
                    listaTarefa: [
                        { numTarefa: '0000000', numAlteracao: 1, tipoAlteracao: 'A' },
                        { numTarefa: '1155478', numAlteracao: 1, tipoAlteracao: 'M' }
                    ]
                },
                {
                    pathArtefato: 'src/main/java/br/com/bb/apc/api/v1/fornecedor/gateway/GatewayListarParametroFormaPagamento.java',
                    listaTarefa: [
                        { numTarefa: '0000000', numAlteracao: 1, tipoAlteracao: 'A' },
                        { numTarefa: '1155478', numAlteracao: 1, tipoAlteracao: 'D' }
                    ]
                },
                {
                    pathArtefato: 'src/main/java/br/com/bb/apc/api/v1/contrato/resources/ContratoResource.java',
                    listaTarefa: [
                        { numTarefa: '0000000', numAlteracao: 1, tipoAlteracao: 'A' },
                        { numTarefa: '1150152', numAlteracao: 2, tipoAlteracao: 'M' }
                    ]
                },
                {
                    pathArtefato: 'src/main/java/br/com/bb/apc/api/v1/contrato/gateway/GatewayListarFornecedoresCredoresContratosLocacaoImoveis.java',
                    listaTarefa: [
                        { numTarefa: '0000000', numAlteracao: 1, tipoAlteracao: 'A' },
                        { numTarefa: '1150152', numAlteracao: 1, tipoAlteracao: 'M' }
                    ]
                },
                {
                    pathArtefato: {
                        origem: 'src/main/java/br/com/bb/apc/api/v1/contrato/gateway/GatewayListarFornecedoresCredoresContratosLocacaoImoveis.java',
                        destino: 'src/main/java/br/com/bb/apc/api/v1/contrato/gateway/GatewayListarFornecedoresCredoresContratosArrendamentoImoveis.java'
                    },
                    listaTarefa: [
                        { numTarefa: '0000000', numAlteracao: 1, tipoAlteracao: 'A' },
                        { numTarefa: { origem: '0000000', destino: '1150152' }, numAlteracao: 1, tipoAlteracao: 'R' }
                    ]
                }
                ]
            }, {
                repo: {},
                nomeProjeto: 'apc-estatico',
                listaArtefato: [{
                    pathArtefato: 'src/app/spas/contrato/consulta/detalhaContrato/detalha-contrato.tpl.html',
                    listaTarefa: [
                        { numTarefa: '0000000', numAlteracao: 1, tipoAlteracao: 'A' },
                        { numTarefa: '1168815', numAlteracao: 1, tipoAlteracao: 'M' },
                        { numTarefa: '1150152', numAlteracao: 1, tipoAlteracao: 'M' }
                    ]
                },
                {
                    pathArtefato: 'src/app/spas/contrato/consulta/detalhaContrato/fornecedor/lista-fornecedor.tpl.html',
                    listaTarefa: [
                        { numTarefa: '0000000', numAlteracao: 1, tipoAlteracao: 'A' },
                        { numTarefa: '1168815', numAlteracao: 4, tipoAlteracao: 'M' },
                        { numTarefa: '1168800', numAlteracao: 4, tipoAlteracao: 'M' },
                        { numTarefa: '1167319', numAlteracao: 3, tipoAlteracao: 'M' },
                        { numTarefa: '1163642', numAlteracao: 4, tipoAlteracao: 'M' },
                        { numTarefa: '1155478', numAlteracao: 4, tipoAlteracao: 'M' },
                        { numTarefa: '1150152', numAlteracao: 4, tipoAlteracao: 'M' }
                    ]
                },
                {
                    pathArtefato: 'src/app/spas/contrato/consulta/detalhaContrato/fornecedor/modalDadosFornecedor/manter-fornecedor.tpl.html',
                    listaTarefa: [
                        { numTarefa: '0000000', numAlteracao: 1, tipoAlteracao: 'A' },
                        { numTarefa: '1168800', numAlteracao: 7, tipoAlteracao: 'M' },
                        { numTarefa: '1167319', numAlteracao: 7, tipoAlteracao: 'M' },
                        { numTarefa: '1163642', numAlteracao: 7, tipoAlteracao: 'M' },
                        { numTarefa: '1155478', numAlteracao: 7, tipoAlteracao: 'M' }
                    ]
                },
                {
                    pathArtefato: 'src/app/spas/contrato/consulta/detalhaContrato/abas-detalha-contrato.html',
                    listaTarefa: [
                        { numTarefa: '0000000', numAlteracao: 1, tipoAlteracao: 'A' },
                        { numTarefa: '1168815', numAlteracao: 1, tipoAlteracao: 'M' },
                        { numTarefa: '1150152', numAlteracao: 1, tipoAlteracao: 'M' }
                    ]
                },
                {
                    pathArtefato: 'src/app/spas/contrato/contrato.app.html',
                    listaTarefa: [
                        { numTarefa: '0000000', numAlteracao: 1, tipoAlteracao: 'A' },
                        { numTarefa: '1155478', numAlteracao: 1, tipoAlteracao: 'M' },
                        { numTarefa: '1150152', numAlteracao: 1, tipoAlteracao: 'M' }
                    ]
                },
                {
                    pathArtefato: 'package.json',
                    listaTarefa: [
                        { numTarefa: '0000000', numAlteracao: 1, tipoAlteracao: 'A' },
                        { numTarefa: '1168800', numAlteracao: 2, tipoAlteracao: 'M' },
                        { numTarefa: '1163642', numAlteracao: 1, tipoAlteracao: 'M' },
                        { numTarefa: '1155478', numAlteracao: 2, tipoAlteracao: 'M' },
                        { numTarefa: '1150152', numAlteracao: 2, tipoAlteracao: 'M' }
                    ]
                },
                {
                    pathArtefato: 'spec/app/spas/contrato/consulta/detalhaContrato/fornecedor/lista-fornecedor-controllers-spec.js',
                    listaTarefa: [
                        { numTarefa: '0000000', numAlteracao: 1, tipoAlteracao: 'A' },
                        { numTarefa: '1168800', numAlteracao: 1, tipoAlteracao: 'M' },
                        { numTarefa: '1163642', numAlteracao: 1, tipoAlteracao: 'M' },
                        { numTarefa: '1155478', numAlteracao: 1, tipoAlteracao: 'M' }
                    ]
                },
                {
                    pathArtefato: 'Gruntfile.js',
                    listaTarefa: [
                        { numTarefa: '0000000', numAlteracao: 1, tipoAlteracao: 'A' },
                        { numTarefa: '1155478', numAlteracao: 1, tipoAlteracao: 'M' },
                        { numTarefa: '1150152', numAlteracao: 1, tipoAlteracao: 'M' }
                    ]
                },
                {
                    pathArtefato: 'src/app/spas/contrato/contrato-app.js',
                    listaTarefa: [
                        { numTarefa: '0000000', numAlteracao: 1, tipoAlteracao: 'A' },
                        { numTarefa: '1168815', numAlteracao: 1, tipoAlteracao: 'M' },
                        { numTarefa: '1155478', numAlteracao: 1, tipoAlteracao: 'M' },
                        { numTarefa: '1150152', numAlteracao: 1, tipoAlteracao: 'M' }
                    ]
                },
                {
                    pathArtefato: 'src/app/spas/contrato/consulta/detalhaContrato/fornecedor/modalDadosFornecedor/manter-fornecedor-controller.js',
                    listaTarefa: [
                        { numTarefa: '0000000', numAlteracao: 1, tipoAlteracao: 'A' },
                        { numTarefa: '1168800', numAlteracao: 7, tipoAlteracao: 'M' },
                        { numTarefa: '1167319', numAlteracao: 9, tipoAlteracao: 'M' },
                        { numTarefa: '1163642', numAlteracao: 8, tipoAlteracao: 'M' },
                        { numTarefa: '1155478', numAlteracao: 9, tipoAlteracao: 'M' }
                    ]
                },
                {
                    pathArtefato: 'src/app/spas/contrato/contrato-services.js',
                    listaTarefa: [
                        { numTarefa: '0000000', numAlteracao: 1, tipoAlteracao: 'A' },
                        { numTarefa: '1163642', numAlteracao: 3, tipoAlteracao: 'M' },
                        { numTarefa: '1155478', numAlteracao: 3, tipoAlteracao: 'M' },
                        { numTarefa: '1150152', numAlteracao: 3, tipoAlteracao: 'M' }
                    ]
                },
                {
                    pathArtefato: 'src/app/spas/contrato/consulta/detalhaContrato/fornecedor/lista-fornecedor-controllers.js',
                    listaTarefa: [
                        { numTarefa: '0000000', numAlteracao: 1, tipoAlteracao: 'A' },
                        { numTarefa: '1168800', numAlteracao: 5, tipoAlteracao: 'M' },
                        { numTarefa: '1167319', numAlteracao: 6, tipoAlteracao: 'M' },
                        { numTarefa: '1163642', numAlteracao: 5, tipoAlteracao: 'M' },
                        { numTarefa: '1155478', numAlteracao: 6, tipoAlteracao: 'M' },
                        { numTarefa: '1150152', numAlteracao: 5, tipoAlteracao: 'M' }
                    ]
                },
                {
                    pathArtefato: 'src/app/spas/pagamento/despachoPagamento/modal-detalha-cronograma-contrato/detalha-cronograma-contrato.tpl.html',
                    listaTarefa: [
                        { numTarefa: '0000000', numAlteracao: 1, tipoAlteracao: 'A' },
                        { numTarefa: '1168800', numAlteracao: 1, tipoAlteracao: 'M' }
                    ]
                },
                {
                    pathArtefato: 'src/app/scripts/apc-constantes.js',
                    listaTarefa: [
                        { numTarefa: '0000000', numAlteracao: 1, tipoAlteracao: 'A' },
                        { numTarefa: '1168800', numAlteracao: 1, tipoAlteracao: 'M' }
                    ]
                },
                {
                    pathArtefato: 'src/app/scripts/apc-utils.js',
                    listaTarefa: [
                        { numTarefa: '0000000', numAlteracao: 1, tipoAlteracao: 'A' },
                        { numTarefa: '1155478', numAlteracao: 3, tipoAlteracao: 'M' }
                    ]
                },
                {
                    pathArtefato: 'src/app/styles/apc.css',
                    listaTarefa: [
                        { numTarefa: '0000000', numAlteracao: 1, tipoAlteracao: 'A' },
                        { numTarefa: '1150152', numAlteracao: 1, tipoAlteracao: 'M' }
                    ]
                }]
            },
            {
                repo: {},
                nomeProjeto: 'crm-patrimonio-estatico',
                listaArtefato: [
                    {
                        pathArtefato: 'package.json',
                        listaTarefa: [
                            { numTarefa: '0000000', numAlteracao: 1, tipoAlteracao: 'A' },
                            { numTarefa: '1168815', numAlteracao: 4, tipoAlteracao: 'M' }
                        ]
                    },
                    {
                        pathArtefato: 'Gruntfile.js',
                        listaTarefa: [
                            { numTarefa: '0000000', numAlteracao: 1, tipoAlteracao: 'A' },
                            { numTarefa: '1163642', numAlteracao: 1, tipoAlteracao: 'M' }
                        ]
                    }]
            },
            {
                repo: {},
                nomeProjeto: 'crm-patrimonio-api',
                listaArtefato: [
                    {
                        pathArtefato: 'src/main/java/br/com/bb/crm/api/v1/despachoPagamento/resource/DespachoPagamentoResource.java',
                        listaTarefa: [
                            { numTarefa: '0000000', numAlteracao: 1, tipoAlteracao: 'A' },
                            { numTarefa: '1161422', numAlteracao: 1, tipoAlteracao: 'M' }
                        ]
                    },
                    {
                        pathArtefato: 'src/main/java/br/com/bb/crm/api/v1/despachoPagamento/gateway/GatewayListarContratosArrendamentoFaseCronogramaFinanceiro.java',
                        listaTarefa: [
                            { numTarefa: '0000000', numAlteracao: 1, tipoAlteracao: 'A' },
                            { numTarefa: '1161422', numAlteracao: 1, tipoAlteracao: 'M' }
                        ]
                    },
                    {
                        pathArtefato: 'src/test/java/br/com/bb/crm/api/v1/resources/DespachoPagamentoResourceTest.java',
                        listaTarefa: [
                            { numTarefa: '0000000', numAlteracao: 1, tipoAlteracao: 'A' },
                            { numTarefa: '1161422', numAlteracao: 1, tipoAlteracao: 'M' }
                        ]
                    },
                    {
                        pathArtefato: 'src/test/java/br/com/bb/crm/api/v1/gateway/GatewayListarContratosCronogramaFaseTest.java',
                        listaTarefa: [
                            { numTarefa: '0000000', numAlteracao: 1, tipoAlteracao: 'A' },
                            { numTarefa: '1161422', numAlteracao: 1, tipoAlteracao: 'M' }
                        ]
                    },
                    {
                        pathArtefato: 'pom.xml',
                        listaTarefa: [
                            { numTarefa: '0000000', numAlteracao: 1, tipoAlteracao: 'A' },
                            { numTarefa: '1161422', numAlteracao: 2, tipoAlteracao: 'M' }
                        ]
                    }]
            },

        ]
    })

    it('test', async () => {

        jest.setTimeout(10000)

        await geradorUtilTest.criarEstrutura(listaEstrutura)

        const params = new Param({
            diretorio: geradorUtilTest.pathTest(),
            autor: "fulano",
            projeto: ["apc-estatico", "apc-api", "crm-patrimonio-estatico", "crm-patrimonio-api"],
            task: ["1168815", "1172414", "1168800", "1167319", "1163642", "1155478", "1150152", "1161422"],
            mostrarNumModificacao: true,
            mostrarDeletados: true
        })

        const lista = await gerador(params).gerarListaArtefato()

        expect(lista[16].listaNumTarefaSaida).toHaveLength(1)
        expect(lista[16].listaArtefatoSaida[0].numeroAlteracao).toBe(1)
        expect(lista[16].listaArtefatoSaida[0].tipoAlteracao).toBe('D')
        expect(lista[16].listaArtefatoSaida[1].numeroAlteracao).toBe(1)
        expect(lista[16].listaArtefatoSaida[1].tipoAlteracao).toBe('D')

        expect(lista[19].listaNumTarefaSaida).toHaveLength(1)
        expect(lista[19].listaArtefatoSaida[1].numeroAlteracao).toBe(1)
        expect(lista[19].listaArtefatoSaida[1].tipoAlteracao).toBe('D')

        expect(lista[20].listaNumTarefaSaida).toHaveLength(1)
        expect(lista[20].listaArtefatoSaida[2].numeroAlteracao).toBe(1)
        expect(lista[20].listaArtefatoSaida[2].tipoAlteracao).toBe('R')
    })

    afterEach(() => {

        geradorUtilTest.removerDiretorioTest()
    })
})