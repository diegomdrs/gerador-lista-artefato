const Param = require('../models/param')
const GeradorTestUtil = require('./gerador-test-util')

const nomeProjeto = 'foo'
const autor = 'fulano'

const Gerador = require('../lib/gerador')

describe('test gerais', () => {

    let gerador, gitUtil, params = {}

    beforeEach(async () => {

        gitUtil = await new GeradorTestUtil(nomeProjeto, autor)

        params = new Param({
            autor: "fulano",
            listaProjeto: [
                gitUtil.obterCaminhoProjeto()
            ],
            listaTarefa: ["1111111", "2222222"],
            mostrarNumModificacao: true,
            mostrarCommitsLocais: true,
            mostrarDeletados: true,
            mostrarRenomeados: true
        })

        gerador = new Gerador(params)
    })

    it('teste do modulo Param com parametros repetidos', () => {

        const params = new Param({
            autor: "fulano",
            listaProjeto: ["bar", "bar", "bar", "bar", "bar", "bar"],
            listaTarefa: ["1111111", "1111111", "1111111"]
        })

        expect(params.listaTarefa).toHaveLength(1)
        expect(params.listaTarefa[0]).toBe('1111111')

        expect(params.listaProjeto).toHaveLength(1)
        expect(params.listaProjeto[0]).toBe('bar')
    })

    it('teste de listagem de artefatos com projeto inválido', async () => {

        const paramsError = new Param({
            autor: "fulano",
            listaProjeto: ["qux"],
            listaTarefa: ["1111111"]
        })

        const gerador = new Gerador(paramsError)

        expect.assertions(1);
        expect(gerador.init()).rejects.toEqual(
            new Error(`Projeto ${paramsError.listaProjeto[0]} não encontrado`));
    })

    afterAll(async () => {
        (await new GeradorTestUtil('', '')).removerDiretorioTest()
    })
})

describe('teste de obtenção da mensagem de commit', () => {

    beforeEach(async () => {

        const params = new Param({
            autor: "fulano",
            listaProjeto: ['/tmp'],
            listaTarefa: ["1111111", "2222222"],
            mostrarNumModificacao: true,
            mostrarCommitsLocais: true,
            mostrarDeletados: true,
            mostrarRenomeados: true
        })

        gerador = new Gerador(params)
    })

    it('teste com colchetes', () => {

        const commitMessage = 'task 265021 - [Texto entre colchetes] Resto da mensagem do commit'

        const { numeroTarefa, descricaoTarefa } = gerador.obterMessagemCommit(commitMessage)

        expect(numeroTarefa).toEqual('265021')
        expect(descricaoTarefa).toEqual('[Texto entre colchetes] Resto da mensagem do commit')
    })

    it('teste com 2 colchetes', () => {

        const commitMessage = 'task 272315 - [Texto entre colchetes] [Outro texto entre colchetes] Resto da mensagem do commit'

        const { numeroTarefa, descricaoTarefa } = gerador.obterMessagemCommit(commitMessage)

        expect(numeroTarefa).toEqual('272315')
        expect(descricaoTarefa).toEqual('[Texto entre colchetes] [Outro texto entre colchetes] Resto da mensagem do commit')
    })

    it('teste sem task', () => {

        const commitMessage = '272315 Resto da mensagem do commit'

        const { numeroTarefa, descricaoTarefa } = gerador.obterMessagemCommit(commitMessage)

        expect(numeroTarefa).toEqual('272315')
        expect(descricaoTarefa).toEqual('Resto da mensagem do commit')
    })

    it('teste sem task', () => {

        const commitMessage = '27231 - Resto da mensagem do commit'

        const { numeroTarefa, descricaoTarefa } = gerador.obterMessagemCommit(commitMessage)

        expect(numeroTarefa).toEqual('27231')
        expect(descricaoTarefa).toEqual('Resto da mensagem do commit')
    })

    it('teste com tarefa', () => {

        const commitMessage = 'Tarefa 272315 Resto da mensagem do commit'

        const { numeroTarefa, descricaoTarefa } = gerador.obterMessagemCommit(commitMessage)

        expect(numeroTarefa).toEqual('272315')
        expect(descricaoTarefa).toEqual('Resto da mensagem do commit')
    })

    it('teste com tarefa', () => {

        const commitMessage = 'Tarefa nº 269760 - Resto da mensagem do commit'

        const { numeroTarefa, descricaoTarefa } = gerador.obterMessagemCommit(commitMessage)

        expect(numeroTarefa).toEqual('269760')
        expect(descricaoTarefa).toEqual('Resto da mensagem do commit')
    })
})
