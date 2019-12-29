const Param = require('../models/param')
const geradorUtilTest = require('./gerador-util-test')

const nomeProjeto = 'foo'
let git, gerador, params = {}

describe('test gerais', () => {

    beforeEach(async () => {

        git = await geradorUtilTest.criarRepo(nomeProjeto)
        gerador = require('../lib/gerador')
        params = new Param({
            autor: "fulano",
            projeto: [
                geradorUtilTest.pathTest() + "/" + nomeProjeto
            ],
            task: ["1111111"]
        })
    })

    xit('test parâmetros inválidos', () => {

        // const req = {
        //     diretorio: "/home/foo/Documents/gerador-lista-artefato-qas/test/gerador-lista-artefato-qas",
        //     autor: "fulano",
        //     projeto: ["apc-estatico", "crm-patrimonio-estatico"],
        //     task: ["1199211", "1203082", "1203670", "1207175", "1210684", "1210658", "1212262", "1212444"]
        // }
    });

    xit('test listagem de artefatos com projeto inválido', () => {

        const paramsError = new Param({
            autor: "fulano",
            projeto: ["bar"],
            task: ["1111111"]
        })

        expect.assertions(1);
        return expect(gerador(paramsError).gerarListaArtefato()).rejects.toEqual(
            new Error('Projeto \'' + paramsError.projeto[0] + '\' não encontrado'));
    });


    it('test listagem de artefatos renomeados', async () => {

        await geradorUtilTest.criarArquivo(git, nomeProjeto, '1111111',
            'arquivoFoo.txt', 'A')

        await geradorUtilTest.criarArquivo(git, nomeProjeto, '1111111',
            'arquivoFoo.txt', 'M')

        await geradorUtilTest.criarArquivo(git, nomeProjeto,
            {
                origem: '1111111', destino: '1111111'
            },
            {
                origem: 'arquivoFoo.txt', destino: 'arquivoQux.txt'
            }, 'R')

        await geradorUtilTest.criarArquivo(git, nomeProjeto, '1111111',
            'arquivoQux.txt', 'M')

        const lista = await gerador(params).gerarListaArtefato()

        expect(lista[0].listaNumTarefaSaida).toHaveLength(1)
        expect(lista[0].listaNumTarefaSaida[0]).toBe('1111111')

        expect(lista[0].listaArtefatoSaida[0].tipoAlteracao).toBe('R')
        expect(lista[0].listaArtefatoSaida[0].nomeArtefato).toBe('foo/arquivoQux.txt')

        expect(lista[0].listaArtefatoSaida[1].tipoAlteracao).toBe('A')
        expect(lista[0].listaArtefatoSaida[1].nomeArtefato).toBe('foo/arquivoQux.txt')
    })

    xit('test listagem de artefatos commitados em branches diferentes', async () => {

        await geradorUtilTest.checkoutBranch(git, 'branchFoo')
        await geradorUtilTest.criarArquivo(git, nomeProjeto, '1111111', 'arquivoFoo.txt', 'A')

        await geradorUtilTest.checkoutBranch(git, 'branchBar')
        await geradorUtilTest.criarArquivo(git, nomeProjeto, '1111111', 'arquivoBar.txt', 'A')

        await geradorUtilTest.checkoutBranch(git, 'master')

        const lista = await gerador(params).gerarListaArtefato()

        expect(lista[0].listaNumTarefaSaida).toHaveLength(1)
        expect(lista[0].listaNumTarefaSaida).toEqual(expect.arrayContaining(['1111111']))

        expect(lista[0].listaArtefatoSaida[0].numeroAlteracao).toBe(1)
        expect(lista[0].listaArtefatoSaida[0].tipoAlteracao).toBe('A')
        expect(lista[0].listaArtefatoSaida[0].nomeArtefato).toBe(
            nomeProjeto + '/arquivoFoo.txt')

        expect(lista[0].listaArtefatoSaida[1].numeroAlteracao).toBe(1)
        expect(lista[0].listaArtefatoSaida[1].tipoAlteracao).toBe('A')
        expect(lista[0].listaArtefatoSaida[1].nomeArtefato).toBe(
            nomeProjeto + '/arquivoBar.txt')
    })

    afterEach(() => {

        // geradorUtilTest.removerDiretorioTest()
    })
})