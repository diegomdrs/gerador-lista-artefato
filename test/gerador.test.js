const Param = require('../models/param')
const geradorUtilTest = require('./gerador-util-test')

const nomeProjeto = 'foo'
let git = {}

describe('test comando diego', () => {

    beforeAll(async () => {

        git = await geradorUtilTest.criarRepo(nomeProjeto)
    })

    it('test parâmetros inválidos', () => {

       
    });

    it('test listagem de artefatos com projeto inválido', () => {

        const gerador = require('../lib/gerador-new-promise')
        const paramsError = new Param({
            diretorio: geradorUtilTest.pathTest(),
            autor: "fulano",
            projeto: ["bar"],
            task: ["1111111"]
        })

        expect.assertions(1);
        return expect(gerador(paramsError).gerarListaArtefato()).rejects.toEqual(
            new Error('Projeto \'' + paramsError.projeto[0] + '\' não encontrado'));
    });

    it('test listagem de artefatos com diretorio inválido', () => {

        const gerador = require('../lib/gerador-new-promise')
        const paramsError = new Param({
            diretorio: 'tmp',
            autor: "fulano",
            projeto: ["bar"],
            task: ["1111111"]
        })

        expect.assertions(1);
        return expect(gerador(paramsError).gerarListaArtefato()).rejects.toEqual(
            new Error('Diretório \'' + paramsError.diretorio + '\' não encontrado'));
    });

    it('test listagem de artefatos commitados em branches diferentes', async () => {

        const gerador = require('../lib/gerador-new-promise')
        const params = new Param({
            diretorio: geradorUtilTest.pathTest(),
            autor: "fulano",
            projeto: ["foo"],
            task: ["1111111"]
        })

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

    afterAll(() => {

        geradorUtilTest.removerDiretorioTest()
    })
})