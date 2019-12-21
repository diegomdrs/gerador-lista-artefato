const gerador = require('../lib/gerador')
const Param = require('../models/param')
const geradorUtilTest = require('./gerador-util-test')

describe('test foo', () => {

    it('test gerador comando diego', async () => {

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
})