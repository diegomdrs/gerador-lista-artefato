const gerador = require('../lib/gerador')
const Param = require('../models/param')
const geradorUtilTest = require('./gerador-util-test')

let listaEstrutura = []

describe('test foo', () => {

    beforeEach(async () => {

        // node app --diretorio=/kdi/git --projeto=apc-estatico,apc-api,crm-patrimonio-estatico,crm-patrimonio-api --autor=c1282036 --task=1168815,1172414,1168800,1167319,1163642,1155478,1150152,1161422 --mostrar-num-modificacao --mostrar-deletados
        listaEstrutura = [
            {
                repo: {},
                nomeProjeto: 'apc-estatico',
                listaArtefato: []
            },{
                repo: {},
                nomeProjeto: 'crm-patrimonio-estatico',
                listaArtefato: []
            },{
                repo: {},
                nomeProjeto: 'apc-api',
                listaArtefato: []
            },{
                repo: {},
                nomeProjeto: 'crm-patrimonio-api',
                listaArtefato: []
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