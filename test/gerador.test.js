const Param = require('../models/param')
const geradorUtilTest = require('./gerador-util-test')
const fs = require('fs-extra')

let params = {}

describe('test comando diego', () => {

    beforeAll(async () => {

    })

    it('test listagem de artefatos commitados em branches', async () => {
        
        const nomeProjeto = 'foo'
        const git = await geradorUtilTest.criarRepo(nomeProjeto)
        const gerador = require('../lib/gerador-new-promise')

        params = new Param({
            diretorio: geradorUtilTest.pathTest(),
            autor: "fulano",
            projeto: ["foo"],
            task: ["1111111"]
        })

        await geradorUtilTest.checkoutBranch(git, 'branchFoo')
        await geradorUtilTest.criarArquivo(git, nomeProjeto, '1111111', 'arquivo.txt', 'A')
        await geradorUtilTest.checkoutBranch(git, 'master')

        const lista = await gerador(params).gerarListaArtefato()

        expect(lista[0].listaNumTarefaSaida).toHaveLength(1)
        expect(lista[0].listaNumTarefaSaida).toEqual(expect.arrayContaining(['1111111']))
        expect(lista[0].listaArtefatoSaida[0].numeroAlteracao).toBe(1)
        expect(lista[0].listaArtefatoSaida[0].tipoAlteracao).toBe('A')
    })

    afterAll(() => {

        geradorUtilTest.removerDiretorioTest()
    })

    function testarLista(lista) {

        expect(lista[0].listaNumTarefaSaida).toHaveLength(2)
        expect(lista[0].listaNumTarefaSaida).toEqual(
            expect.arrayContaining(['1150152', '1155478']))
        expect(lista[0].listaArtefatoSaida[0].numeroAlteracao).toBe(9)
    }
})