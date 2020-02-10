const Param = require('../models/param')
const GeradorTestUtil = require('./gerador-test-util')

const TIPO_MODIFICACAO = require('../lib/constants').TIPO_MODIFICACAO

const nomeProjeto = 'foo'
const autor = 'fulano'

let gitUtil, gerador, params = {}

describe('test gerais', () => {

    beforeEach(async () => {

        gitUtil = new GeradorTestUtil(nomeProjeto, autor)

        gerador = require('../lib/gerador')

        params = new Param({
            autor: "fulano",
            listaProjeto: [
                gitUtil.pathTest() + "/" + nomeProjeto
            ],
            listaTarefa: ["1111111"],
            mostrarNumModificacao: true,
            mostrarCommitsLocais: true,
            mostrarDeletados: true,
            mostrarRenomeados: true
        })
    })

    it('test parâmetros inválidos', () => {

        console.log(gitUtil)
    });

    xit('test parâmetros inválidos', () => {

        // const req = {
        //     diretorio: "/home/foo/Documents/gerador-lista-artefato-qas/test/gerador-lista-artefato-qas",
        //     autor: "fulano",
        //     listaProjeto: ["apc-estatico", "crm-patrimonio-estatico"],
        //     listaTarefa: ["1199211", "1203082", "1203670", "1207175", "1210684", "1210658", "1212262", "1212444"]
        // }
    });

    xit('teste do modulo Param com parametros repetidos', () => {

        const params = new Param({
            autor: "fulano",
            listaProjeto: ["bar", "bar", "bar", "bar", "bar", "bar"],
            listaTarefa: ["1111111", "1111111", "1111111"]
        })

        expect(params.listaTarefa).toHaveLength(1)
        expect(params.listaTarefa[0]).toBe('1111111')

        expect(params.listaProjeto).toHaveLength(1)
        expect(params.listaProjeto[0]).toBe('bar')
    });

    xit('teste de listagem de artefatos com projeto inválido', () => {

        const paramsError = new Param({
            autor: "fulano",
            listaProjeto: ["bar"],
            listaTarefa: ["1111111"]
        })

        expect.assertions(1);
        return expect(gerador(paramsError).gerarListaArtefato()).rejects.toEqual(
            new Error(`Projeto ${paramsError.listaProjeto[0]} não encontrado`));
    });

    xit('teste de listagem de artefatos renomeados', async () => {

        await gitUtil.manipularArquivoComCommit('1111111',
            'arquivoFoo.txt', TIPO_MODIFICACAO.ADDED)

        await gitUtil.manipularArquivoComCommit('1111111',
            'arquivoFoo.txt', TIPO_MODIFICACAO.MODIFIED)

        await gitUtil.manipularArquivoComCommit(
            { origem: '1111111', destino: '1111111' },
            { origem: 'arquivoFoo.txt', destino: 'arquivoQux.txt' },
            TIPO_MODIFICACAO.RENAMED)

        await gitUtil.manipularArquivoComCommit('1111111',
            'arquivoQux.txt', TIPO_MODIFICACAO.MODIFIED)

        const lista = await gerador(params).gerarListaArtefato()

        expect(lista).toHaveLength(2)

        expect(lista[0].listaNumTarefaSaida).toHaveLength(1)
        expect(lista[0].listaNumTarefaSaida[0]).toBe('1111111')
        expect(lista[0].listaArtefatoSaida).toHaveLength(1)

        expect(lista[0].listaArtefatoSaida[0].tipoAlteracao).toBe(TIPO_MODIFICACAO.ADDED)
        expect(lista[0].listaArtefatoSaida[0].numeroAlteracao).toBe(1)
        expect(lista[0].listaArtefatoSaida[0].nomeArtefato).toBe('foo/arquivoQux.txt')

        expect(lista[1].listaNumTarefaSaida).toHaveLength(1)
        expect(lista[1].listaNumTarefaSaida[0]).toBe('1111111')
        expect(lista[1].listaArtefatoSaida).toHaveLength(1)

        expect(lista[1].listaArtefatoSaida[0].tipoAlteracao).toBe(TIPO_MODIFICACAO.RENAMED)
        expect(lista[1].listaArtefatoSaida[0].numeroAlteracao).toBe(1)
        expect(lista[1].listaArtefatoSaida[0].nomeArtefato).toBe('foo/arquivoQux.txt')
        expect(lista[1].listaArtefatoSaida[0].nomeAntigoArtefato).toBe('foo/arquivoFoo.txt')
        expect(lista[1].listaArtefatoSaida[0].nomeNovoArtefato).toBe('foo/arquivoQux.txt')
    })

    xit('teste de listagem de artefatos renomeados 2 vezes', async () => {

        await gitUtil.manipularArquivoComCommit('1111111',
            'arquivoFoo.txt', TIPO_MODIFICACAO.ADDED)

        await gitUtil.manipularArquivoComCommit('1111111',
            'arquivoFoo.txt', TIPO_MODIFICACAO.MODIFIED)

        await gitUtil.manipularArquivoComCommit(
            { origem: '1111111', destino: '1111111' },
            { origem: 'arquivoFoo.txt', destino: 'arquivoQux.txt' }, TIPO_MODIFICACAO.RENAMED)

        await gitUtil.manipularArquivoComCommit('1111111',
            'arquivoQux.txt', TIPO_MODIFICACAO.MODIFIED)

        await gitUtil.manipularArquivoComCommit(
            { origem: '1111111', destino: '1111111' },
            { origem: 'arquivoQux.txt', destino: 'arquivoBar.txt' }, TIPO_MODIFICACAO.RENAMED)

        await gitUtil.manipularArquivoComCommit('1111111',
            'arquivoBar.txt', TIPO_MODIFICACAO.MODIFIED)

        const lista = await gerador(params).gerarListaArtefato()

        expect(lista).toHaveLength(2)

        expect(lista[0].listaNumTarefaSaida).toHaveLength(1)
        expect(lista[0].listaNumTarefaSaida[0]).toBe('1111111')
        expect(lista[0].listaArtefatoSaida).toHaveLength(1)

        expect(lista[0].listaArtefatoSaida[0].tipoAlteracao).toBe(TIPO_MODIFICACAO.ADDED)
        expect(lista[0].listaArtefatoSaida[0].numeroAlteracao).toBe(1)
        expect(lista[0].listaArtefatoSaida[0].nomeArtefato).toBe('foo/arquivoBar.txt')

        expect(lista[1].listaNumTarefaSaida).toHaveLength(1)
        expect(lista[1].listaNumTarefaSaida[0]).toBe('1111111')
        expect(lista[1].listaArtefatoSaida).toHaveLength(1)

        expect(lista[1].listaArtefatoSaida[0].tipoAlteracao).toBe(TIPO_MODIFICACAO.RENAMED)
        expect(lista[1].listaArtefatoSaida[0].numeroAlteracao).toBe(2)
        expect(lista[1].listaArtefatoSaida[0].nomeArtefato).toBe('foo/arquivoBar.txt')
        expect(lista[1].listaArtefatoSaida[0].nomeAntigoArtefato).toBe('foo/arquivoQux.txt')
        expect(lista[1].listaArtefatoSaida[0].nomeNovoArtefato).toBe('foo/arquivoBar.txt')
    })

    xit('teste de listagem de artefato A, R, D e A novamente', async () => {

        await gitUtil.manipularArquivoComCommit('1111111',
            'arquivoFoo.txt', TIPO_MODIFICACAO.ADDED)

        await gitUtil.manipularArquivoComCommit('1111111',
            'arquivoFoo.txt', TIPO_MODIFICACAO.MODIFIED)

        await gitUtil.manipularArquivoComCommit(
            { origem: '1111111', destino: '1111111' },
            { origem: 'arquivoFoo.txt', destino: 'arquivoQux.txt' }, TIPO_MODIFICACAO.RENAMED)

        await gitUtil.manipularArquivoComCommit('1111111',
            'arquivoQux.txt', TIPO_MODIFICACAO.MODIFIED)

        await gitUtil.manipularArquivoComCommit(
            { origem: '1111111', destino: '1111111' },
            { origem: 'arquivoQux.txt', destino: 'arquivoBar.txt' }, TIPO_MODIFICACAO.RENAMED)

        await gitUtil.manipularArquivoComCommit('1111111',
            'arquivoBar.txt', TIPO_MODIFICACAO.MODIFIED)

        await gitUtil.manipularArquivoComCommit('1111111',
            'arquivoBar.txt', TIPO_MODIFICACAO.DELETED)

        await gitUtil.manipularArquivoComCommit('1111111',
            'arquivoFoo.txt', TIPO_MODIFICACAO.ADDED)

        const lista = await gerador(params).gerarListaArtefato()

        expect(lista).toHaveLength(2)

        expect(lista[0].listaNumTarefaSaida).toHaveLength(1)
        expect(lista[0].listaNumTarefaSaida[0]).toBe('1111111')
        expect(lista[0].listaArtefatoSaida).toHaveLength(1)

        expect(lista[0].listaArtefatoSaida[0].tipoAlteracao).toBe(TIPO_MODIFICACAO.ADDED)
        expect(lista[0].listaArtefatoSaida[0].numeroAlteracao).toBe(1)
        expect(lista[0].listaArtefatoSaida[0].nomeArtefato).toBe('foo/arquivoBar.txt')

        expect(lista[1].listaNumTarefaSaida).toHaveLength(1)
        expect(lista[1].listaNumTarefaSaida[0]).toBe('1111111')
        expect(lista[1].listaArtefatoSaida).toHaveLength(1)

        expect(lista[1].listaArtefatoSaida[0].tipoAlteracao).toBe(TIPO_MODIFICACAO.DELETED)
        expect(lista[1].listaArtefatoSaida[0].numeroAlteracao).toBe(1)
        expect(lista[1].listaArtefatoSaida[0].nomeArtefato).toBe('foo/arquivoBar.txt')
    })

    xit('teste de listagem de artefato A, M, D e A com mesmo nome, COM opção de mostrar deletados', async () => {

        await gitUtil.manipularArquivoComCommit('1111111',
            'arquivoBar.txt', TIPO_MODIFICACAO.ADDED)

        await gitUtil.manipularArquivoComCommit('1111111',
            'arquivoBar.txt', TIPO_MODIFICACAO.MODIFIED)

        await gitUtil.manipularArquivoComCommit('1111111',
            'arquivoBar.txt', TIPO_MODIFICACAO.DELETED)

        await gitUtil.manipularArquivoComCommit('1111111',
            'arquivoBar.txt', TIPO_MODIFICACAO.ADDED)

        const lista = await gerador(params).gerarListaArtefato()

        expect(lista).toHaveLength(2)

        expect(lista[0].listaNumTarefaSaida).toHaveLength(1)
        expect(lista[0].listaNumTarefaSaida[0]).toBe('1111111')
        expect(lista[0].listaArtefatoSaida).toHaveLength(1)

        expect(lista[0].listaArtefatoSaida[0].tipoAlteracao).toBe(TIPO_MODIFICACAO.ADDED)
        expect(lista[0].listaArtefatoSaida[0].numeroAlteracao).toBe(1)
        expect(lista[0].listaArtefatoSaida[0].nomeArtefato).toBe('foo/arquivoBar.txt')

        expect(lista[1].listaNumTarefaSaida).toHaveLength(1)
        expect(lista[1].listaNumTarefaSaida[0]).toBe('1111111')
        expect(lista[1].listaArtefatoSaida).toHaveLength(1)

        expect(lista[1].listaArtefatoSaida[0].tipoAlteracao).toBe(TIPO_MODIFICACAO.DELETED)
        expect(lista[1].listaArtefatoSaida[0].numeroAlteracao).toBe(1)
        expect(lista[1].listaArtefatoSaida[0].nomeArtefato).toBe('foo/arquivoBar.txt')
    })

    xit('teste de listagem de artefato A, M, D e A com mesmo nome, SEM opção de mostrar deletados', async () => {

        await gitUtil.manipularArquivoComCommit('1111111',
            'arquivoBar.txt', TIPO_MODIFICACAO.ADDED)

        await gitUtil.manipularArquivoComCommit('1111111',
            'arquivoBar.txt', TIPO_MODIFICACAO.MODIFIED)

        await gitUtil.manipularArquivoComCommit('1111111',
            'arquivoBar.txt', TIPO_MODIFICACAO.DELETED)

        await gitUtil.manipularArquivoComCommit('1111111',
            'arquivoBar.txt', TIPO_MODIFICACAO.ADDED)

        params.mostrarDeletados = false

        const lista = await gerador(params).gerarListaArtefato()

        expect(lista).toHaveLength(1)

        expect(lista[0].listaNumTarefaSaida).toHaveLength(1)
        expect(lista[0].listaNumTarefaSaida[0]).toBe('1111111')

        expect(lista[0].listaArtefatoSaida).toHaveLength(1)

        expect(lista[0].listaArtefatoSaida[0].tipoAlteracao).toBe(TIPO_MODIFICACAO.ADDED)
        expect(lista[0].listaArtefatoSaida[0].numeroAlteracao).toBe(1)
        expect(lista[0].listaArtefatoSaida[0].nomeArtefato).toBe('foo/arquivoBar.txt')
    })

    xit('teste de listagem de artefato A, M, D COM opção de mostrar deletados', async () => {

        await gitUtil.manipularArquivoComCommit('1111111',
            'arquivoBar.txt', TIPO_MODIFICACAO.ADDED)

        await gitUtil.manipularArquivoComCommit('1111111',
            'arquivoBar.txt', TIPO_MODIFICACAO.MODIFIED)

        await gitUtil.manipularArquivoComCommit('1111111',
            'arquivoBar.txt', TIPO_MODIFICACAO.DELETED)

        const lista = await gerador(params).gerarListaArtefato()

        expect(lista).toHaveLength(1)

        expect(lista[0].listaNumTarefaSaida).toHaveLength(1)
        expect(lista[0].listaNumTarefaSaida[0]).toBe('1111111')

        expect(lista[0].listaArtefatoSaida).toHaveLength(1)

        expect(lista[0].listaArtefatoSaida[0].tipoAlteracao).toBe(TIPO_MODIFICACAO.DELETED)
        expect(lista[0].listaArtefatoSaida[0].numeroAlteracao).toBe(1)
        expect(lista[0].listaArtefatoSaida[0].nomeArtefato).toBe('foo/arquivoBar.txt')
    })

    xit('teste de listagem de artefato A, M, D SEM opção de mostrar deletados', async () => {

        await gitUtil.manipularArquivoComCommit('1111111',
            'arquivoBar.txt', TIPO_MODIFICACAO.ADDED)

        await gitUtil.manipularArquivoComCommit('1111111',
            'arquivoBar.txt', TIPO_MODIFICACAO.MODIFIED)

        await gitUtil.manipularArquivoComCommit('1111111',
            'arquivoBar.txt', TIPO_MODIFICACAO.DELETED)

        params.mostrarDeletados = false

        const lista = await gerador(params).gerarListaArtefato()

        expect(lista).toHaveLength(0)
    })

    xit('teste de listagem de artefatos criados em branches diferentes', async () => {

        await gitUtil.checkoutBranch('branchFoo')
        await gitUtil.manipularArquivoComCommit(
            '1111111', 'arquivoFoo.txt', TIPO_MODIFICACAO.ADDED)

        await gitUtil.checkoutBranch('branchBar')
        await gitUtil.manipularArquivoComCommit(
            '1111111', 'arquivoBar.txt', TIPO_MODIFICACAO.ADDED)

        await gitUtil.checkoutBranch('master')

        const lista = await gerador(params).gerarListaArtefato()

        expect(lista).toHaveLength(1)

        expect(lista[0].listaNumTarefaSaida).toHaveLength(1)
        expect(lista[0].listaNumTarefaSaida[0]).toBe('1111111')

        expect(lista[0].listaArtefatoSaida).toHaveLength(2)

        expect(lista[0].listaArtefatoSaida[0].tipoAlteracao).toBe(TIPO_MODIFICACAO.ADDED)
        expect(lista[0].listaArtefatoSaida[0].numeroAlteracao).toBe(1)
        expect(lista[0].listaArtefatoSaida[0].nomeArtefato).toBe('foo/arquivoFoo.txt')

        expect(lista[0].listaArtefatoSaida[1].tipoAlteracao).toBe(TIPO_MODIFICACAO.ADDED)
        expect(lista[0].listaArtefatoSaida[1].numeroAlteracao).toBe(1)
        expect(lista[0].listaArtefatoSaida[1].nomeArtefato).toBe('foo/arquivoBar.txt')
    })

    xit('teste de listagem de artefatos commitados de uma vez', async () => {

        await gitUtil.manipularListaArquivoComCommit('0000000', [
            { tipoAlteracao: TIPO_MODIFICACAO.ADDED, pathArquivo: 'src/app/spas/inventario/bem-services.js' },
            { tipoAlteracao: TIPO_MODIFICACAO.ADDED, pathArquivo: 'Gruntfile.js' },
            { tipoAlteracao: TIPO_MODIFICACAO.ADDED, pathArquivo: 'spec/inclusao-foo-controllers-spec.js' },
            { tipoAlteracao: TIPO_MODIFICACAO.ADDED, pathArquivo: 'src/app/spas/imovel/cadastro/alterar-imovel.tpl.html' },
            { tipoAlteracao: TIPO_MODIFICACAO.ADDED, pathArquivo: 'src/app/spas/imovel/cadastro/cadastro-imovel-controllers.js' },
            { tipoAlteracao: TIPO_MODIFICACAO.ADDED, pathArquivo: 'src/app/spas/imovel/cadastro/cadastro-imovel.tpl.html' },
            { tipoAlteracao: TIPO_MODIFICACAO.ADDED, pathArquivo: 'src/app/spas/imovel/inclusao-foo/inclusao-foo-controllers.js' }
        ])

        await gitUtil.manipularListaArquivoComCommit('1111111', [
            { tipoAlteracao: TIPO_MODIFICACAO.MODIFIED, pathArquivo: 'Gruntfile.js' },
            { tipoAlteracao: TIPO_MODIFICACAO.MODIFIED, pathArquivo: 'src/app/spas/imovel/cadastro/alterar-imovel.tpl.html' },
            { tipoAlteracao: TIPO_MODIFICACAO.MODIFIED, pathArquivo: 'src/app/spas/imovel/cadastro/cadastro-imovel-controllers.js' },
            { tipoAlteracao: TIPO_MODIFICACAO.MODIFIED, pathArquivo: 'src/app/spas/imovel/cadastro/cadastro-imovel.tpl.html' },
            { tipoAlteracao: TIPO_MODIFICACAO.MODIFIED, pathArquivo: 'src/app/spas/imovel/inclusao-foo/inclusao-foo-controllers.js' }
        ])

        await gitUtil.manipularListaArquivoComCommit('1111111', [
            { tipoAlteracao: TIPO_MODIFICACAO.MODIFIED, pathArquivo: 'src/app/spas/imovel/cadastro/cadastro-imovel-controllers.js' },
            { tipoAlteracao: TIPO_MODIFICACAO.MODIFIED, pathArquivo: 'src/app/spas/imovel/cadastro/cadastro-imovel.tpl.html' }
        ])

        await gitUtil.manipularListaArquivoComCommit('1111111', [
            { tipoAlteracao: TIPO_MODIFICACAO.MODIFIED, pathArquivo: 'Gruntfile.js' },
            { tipoAlteracao: TIPO_MODIFICACAO.MODIFIED, pathArquivo: 'spec/inclusao-foo-controllers-spec.js' },
            { tipoAlteracao: TIPO_MODIFICACAO.DELETED, pathArquivo: 'src/app/spas/inventario/bem-services.js' }
        ])

        const lista = await gerador(params).gerarListaArtefato()

        expect(lista).toHaveLength(4)

        expect(lista[0].listaNumTarefaSaida).toHaveLength(1)
        expect(lista[0].listaNumTarefaSaida).toEqual(expect.arrayContaining(['1111111']))
        expect(lista[0].listaArtefatoSaida).toHaveLength(1)

        expect(lista[0].listaArtefatoSaida[0].tipoAlteracao).toBe(TIPO_MODIFICACAO.MODIFIED)
        expect(lista[0].listaArtefatoSaida[0].numeroAlteracao).toBe(2)
        expect(lista[0].listaArtefatoSaida[0].nomeArtefato).toMatch(/.*Gruntfile.js$/g)

        expect(lista[1].listaNumTarefaSaida).toHaveLength(1)
        expect(lista[1].listaNumTarefaSaida).toEqual(expect.arrayContaining(['1111111']))
        expect(lista[1].listaArtefatoSaida).toHaveLength(1)

        expect(lista[1].listaArtefatoSaida[0].tipoAlteracao).toBe(TIPO_MODIFICACAO.DELETED)
        expect(lista[1].listaArtefatoSaida[0].numeroAlteracao).toBe(1)
        expect(lista[1].listaArtefatoSaida[0].nomeArtefato).toMatch(/.*bem-services.js$/g)

        expect(lista[2].listaNumTarefaSaida).toHaveLength(1)
        expect(lista[2].listaNumTarefaSaida).toEqual(expect.arrayContaining(['1111111']))
        expect(lista[2].listaArtefatoSaida).toHaveLength(2)

        expect(lista[2].listaArtefatoSaida[0].tipoAlteracao).toBe(TIPO_MODIFICACAO.MODIFIED)
        expect(lista[2].listaArtefatoSaida[0].numeroAlteracao).toBe(2)
        expect(lista[2].listaArtefatoSaida[0].nomeArtefato).toMatch(/.*cadastro-imovel.tpl.html$/g)

        expect(lista[2].listaArtefatoSaida[1].tipoAlteracao).toBe(TIPO_MODIFICACAO.MODIFIED)
        expect(lista[2].listaArtefatoSaida[1].numeroAlteracao).toBe(1)
        expect(lista[2].listaArtefatoSaida[1].nomeArtefato).toMatch(/.*alterar-imovel.tpl.html$/g)

        expect(lista[3].listaNumTarefaSaida).toHaveLength(1)
        expect(lista[3].listaNumTarefaSaida).toEqual(expect.arrayContaining(['1111111']))
        expect(lista[3].listaArtefatoSaida).toHaveLength(3)

        expect(lista[3].listaArtefatoSaida[0].tipoAlteracao).toBe(TIPO_MODIFICACAO.MODIFIED)
        expect(lista[3].listaArtefatoSaida[0].numeroAlteracao).toBe(1)
        expect(lista[3].listaArtefatoSaida[0].nomeArtefato).toMatch(/.*inclusao-foo-controllers-spec.js$/g)

        expect(lista[3].listaArtefatoSaida[1].tipoAlteracao).toBe(TIPO_MODIFICACAO.MODIFIED)
        expect(lista[3].listaArtefatoSaida[1].numeroAlteracao).toBe(2)
        expect(lista[3].listaArtefatoSaida[1].nomeArtefato).toMatch(/.*cadastro-imovel-controllers.js$/g)

        expect(lista[3].listaArtefatoSaida[2].tipoAlteracao).toBe(TIPO_MODIFICACAO.MODIFIED)
        expect(lista[3].listaArtefatoSaida[2].numeroAlteracao).toBe(1)
        expect(lista[3].listaArtefatoSaida[2].nomeArtefato).toMatch(/.*inclusao-foo-controllers.js$/g)
    })

    xit('teste ignorar stashes na listagem de artefatos', async () => {

        await gitUtil.manipularArquivoComCommit('1111111',
            'arquivoBar.txt', TIPO_MODIFICACAO.ADDED)

        await gitUtil.manipularArquivoSemCommit(
            'arquivoBar.txt', TIPO_MODIFICACAO.MODIFIED)

        await gitUtil.stash()

        const lista = await gerador(params).gerarListaArtefato()

        expect(lista).toHaveLength(1)

        expect(lista[0].listaNumTarefaSaida).toHaveLength(1)
        expect(lista[0].listaNumTarefaSaida).toEqual(expect.arrayContaining(['1111111']))
        expect(lista[0].listaArtefatoSaida).toHaveLength(1)

        expect(lista[0].listaArtefatoSaida[0].tipoAlteracao).toBe(TIPO_MODIFICACAO.ADDED)
        expect(lista[0].listaArtefatoSaida[0].numeroAlteracao).toBe(1)
        expect(lista[0].listaArtefatoSaida[0].nomeArtefato).toMatch(/.*arquivoBar.txt$/g)
    })

    xit('teste ignorar commits locais na listagem de artefatos', async () => {

        await gitUtil.manipularArquivoComCommit('1111111',
            'arquivoBar.txt', TIPO_MODIFICACAO.ADDED)

        params.mostrarCommitsLocais = false

        const lista = await gerador(params).gerarListaArtefato()

        expect(lista).toHaveLength(0)
    })

    // node app --diretorio=/tmp/gerador-lista-artefato-qas --projeto=qux,baz --autor=fulano --task=1111111 --mostrar-num-modificacao --mostrar-deletados --mostrar-commits-locais
    xit('teste separar arquivos de projetos diferentes em linhas diferentes', async () => {

        const nomeProjetoQux = 'qux'
        const nomeProjetoBaz = 'baz'

        const gitQux = await gitUtil.criarRepo(nomeProjetoQux, autor)
        const gitBaz = await gitUtil.criarRepo(nomeProjetoBaz, autor)

        await gitQux.manipularArquivoComCommit('1111111', 'arquivoQux.txt', TIPO_MODIFICACAO.ADDED)
        await gitBaz.manipularArquivoComCommit('1111111', 'arquivoBaz.txt', TIPO_MODIFICACAO.ADDED)

        const params = new Param({
            autor: "fulano",
            listaProjeto: [
                gitUtil.pathTest() + "/" + nomeProjetoQux,
                gitUtil.pathTest() + "/" + nomeProjetoBaz,
            ],
            listaTarefa: ["1111111"],
            mostrarNumModificacao: true,
            mostrarCommitsLocais: true,
            mostrarDeletados: true,
            mostrarRenomeados: true
        })

        const lista = await gerador(params).gerarListaArtefato()

        expect(lista).toHaveLength(2)

        expect(lista[0].listaNumTarefaSaida).toHaveLength(1)
        expect(lista[0].listaNumTarefaSaida).toEqual(expect.arrayContaining(['1111111']))
        expect(lista[0].listaArtefatoSaida).toHaveLength(1)

        expect(lista[0].listaArtefatoSaida[0].tipoAlteracao).toBe(TIPO_MODIFICACAO.ADDED)
        expect(lista[0].listaArtefatoSaida[0].numeroAlteracao).toBe(1)
        expect(lista[0].listaArtefatoSaida[0].nomeArtefato).toMatch(/.*arquivoBaz.txt$/g)

        expect(lista[1].listaNumTarefaSaida).toHaveLength(1)
        expect(lista[1].listaNumTarefaSaida).toEqual(expect.arrayContaining(['1111111']))
        expect(lista[1].listaArtefatoSaida).toHaveLength(1)

        expect(lista[1].listaArtefatoSaida[0].tipoAlteracao).toBe(TIPO_MODIFICACAO.ADDED)
        expect(lista[1].listaArtefatoSaida[0].numeroAlteracao).toBe(1)
        expect(lista[1].listaArtefatoSaida[0].nomeArtefato).toMatch(/.*arquivoQux.txt$/g)
    })

    xit('teste de listagem com arquivos com extensoes diferentes separados', async () => {

        await gitUtil.manipularListaArquivoComCommit(git, '1111111', nomeProjeto, [
            { tipoAlteracao: TIPO_MODIFICACAO.MODIFIED, pathArquivo: 'css/foo.css' },
            { tipoAlteracao: TIPO_MODIFICACAO.MODIFIED, pathArquivo: 'spec/inclusao-foo-controllers-spec.js' },
            { tipoAlteracao: TIPO_MODIFICACAO.MODIFIED, pathArquivo: 'src/app/spas/inventario/foo.tpl.html' }
        ])

        const lista = await gerador(params).gerarListaArtefato()

        expect(lista).toHaveLength(3)

        expect(lista[0].listaNumTarefaSaida).toHaveLength(1)
        expect(lista[0].listaNumTarefaSaida).toEqual(expect.arrayContaining(['1111111']))
        expect(lista[0].listaArtefatoSaida).toHaveLength(1)

        expect(lista[0].listaArtefatoSaida[0].tipoAlteracao).toBe(TIPO_MODIFICACAO.ADDED)
        expect(lista[0].listaArtefatoSaida[0].numeroAlteracao).toBe(1)
        expect(lista[0].listaArtefatoSaida[0].nomeArtefato).toMatch(/.*foo.tpl.html$/g)

        expect(lista[1].listaNumTarefaSaida).toHaveLength(1)
        expect(lista[1].listaNumTarefaSaida).toEqual(expect.arrayContaining(['1111111']))
        expect(lista[1].listaArtefatoSaida).toHaveLength(1)

        expect(lista[1].listaArtefatoSaida[0].tipoAlteracao).toBe(TIPO_MODIFICACAO.ADDED)
        expect(lista[1].listaArtefatoSaida[0].numeroAlteracao).toBe(1)
        expect(lista[1].listaArtefatoSaida[0].nomeArtefato).toMatch(/.*inclusao-foo-controllers-spec.js$/g)

        expect(lista[2].listaNumTarefaSaida).toHaveLength(1)
        expect(lista[2].listaNumTarefaSaida).toEqual(expect.arrayContaining(['1111111']))
        expect(lista[2].listaArtefatoSaida).toHaveLength(1)

        expect(lista[2].listaArtefatoSaida[0].tipoAlteracao).toBe(TIPO_MODIFICACAO.ADDED)
        expect(lista[2].listaArtefatoSaida[0].numeroAlteracao).toBe(1)
        expect(lista[2].listaArtefatoSaida[0].nomeArtefato).toMatch(/.*foo.css$/g)
    })

    xit('teste de listagem de artefato A e M mas mostrando somente A', async () => {

        await gitUtil.manipularArquivoComCommit('1111111',
            'arquivoBar.txt', TIPO_MODIFICACAO.ADDED)

        await gitUtil.manipularArquivoComCommit('1111111',
            'arquivoBar.txt', TIPO_MODIFICACAO.MODIFIED)

        await gitUtil.manipularArquivoComCommit('1111111',
            'arquivoBar.txt', TIPO_MODIFICACAO.MODIFIED)

        const lista = await gerador(params).gerarListaArtefato()

        expect(lista).toHaveLength(1)

        expect(lista[0].listaNumTarefaSaida).toHaveLength(1)
        expect(lista[0].listaNumTarefaSaida).toEqual(expect.arrayContaining(['1111111']))
        expect(lista[0].listaArtefatoSaida).toHaveLength(1)

        expect(lista[0].listaArtefatoSaida[0].tipoAlteracao).toBe(TIPO_MODIFICACAO.ADDED)
        expect(lista[0].listaArtefatoSaida[0].numeroAlteracao).toBe(1)
        expect(lista[0].listaArtefatoSaida[0].nomeArtefato).toMatch(/.*arquivoBar.txt$/g)
    })

    xit('teste de listagem de artefato A, M e D mas mostrando somente D', async () => {

        await gitUtil.manipularArquivoComCommit('1111111',
            'arquivoBar.txt', TIPO_MODIFICACAO.ADDED)

        await gitUtil.manipularArquivoComCommit('1111111',
            'arquivoBar.txt', TIPO_MODIFICACAO.MODIFIED)

        await gitUtil.manipularArquivoComCommit('1111111',
            'arquivoBar.txt', TIPO_MODIFICACAO.MODIFIED)

        await gitUtil.manipularArquivoComCommit('1111111',
            'arquivoBar.txt', TIPO_MODIFICACAO.DELETED)

        const lista = await gerador(params).gerarListaArtefato()

        expect(lista).toHaveLength(1)

        expect(lista[0].listaNumTarefaSaida).toHaveLength(1)
        expect(lista[0].listaNumTarefaSaida).toEqual(expect.arrayContaining(['1111111']))
        expect(lista[0].listaArtefatoSaida).toHaveLength(1)

        expect(lista[0].listaArtefatoSaida[0].tipoAlteracao).toBe(TIPO_MODIFICACAO.DELETED)
        expect(lista[0].listaArtefatoSaida[0].numeroAlteracao).toBe(1)
        expect(lista[0].listaArtefatoSaida[0].nomeArtefato).toMatch(/.*arquivoBar.txt$/g)
    })

    xit('teste de listagem com arquivos com tipos diferentes separados', async () => {

        const nomeProjetoFoo = 'foo'
        const nomeProjetoBar = 'bar'

        const gitFoo = await gitUtil.criarRepo(nomeProjetoFoo, autor)
        const gitBar = await gitUtil.criarRepo(nomeProjetoBar, autor)

        const params = new Param({
            autor: "fulano",
            listaProjeto: [
                gitUtil.pathTest() + "/" + nomeProjetoFoo,
                gitUtil.pathTest() + "/" + nomeProjetoBar,
            ],
            listaTarefa: ["1111111", "2222222"],
            mostrarNumModificacao: true,
            mostrarCommitsLocais: true,
            mostrarDeletados: true,
            mostrarRenomeados: true
        })

        await gitUtil.manipularListaArquivoComCommit(gitFoo, '1111111', nomeProjetoFoo, [
            { tipoAlteracao: TIPO_MODIFICACAO.ADDED, pathArquivo: 'src/main/java/br/com/foo/bar/api/v1/resource/BazResource.java' },
            { tipoAlteracao: TIPO_MODIFICACAO.ADDED, pathArquivo: 'src/test/java/br/com/foo/bar/api/v1/resources/test/BazResourceTest.java' }
        ])

        await gitUtil.manipularListaArquivoComCommit(gitFoo, '1111111', nomeProjetoFoo, [
            { tipoAlteracao: TIPO_MODIFICACAO.ADDED, pathArquivo: 'src/main/java/br/com/foo/bar/api/v1/resource/GatewayBar.java' },
            { tipoAlteracao: TIPO_MODIFICACAO.ADDED, pathArquivo: 'src/test/java/br/com/foo/bar/api/v1/resources/test/GatewayBarTest.java' }
        ])

        await gitUtil.manipularArquivoComCommit(gitFoo, nomeProjetoFoo, '1111111',
            'karma.conf.js', TIPO_MODIFICACAO.ADDED)

        await gitUtil.manipularArquivoComCommit(gitFoo, nomeProjetoFoo, '1111111',
            'Gruntfile.js', TIPO_MODIFICACAO.ADDED)
        await gitUtil.manipularArquivoComCommit(gitBar, nomeProjetoBar, '1111111',
            'Gruntfile.js', TIPO_MODIFICACAO.ADDED)

        await gitUtil.manipularListaArquivoComCommit(gitFoo, '1111111', nomeProjetoFoo, [
            { tipoAlteracao: TIPO_MODIFICACAO.ADDED, pathArquivo: 'src/main/java/br/com/foo/bar/api/v1/resource/GatewayBar.java' },
            { tipoAlteracao: TIPO_MODIFICACAO.ADDED, pathArquivo: 'src/test/java/br/com/foo/bar/api/v1/resources/test/GatewayBarTest.java' }
        ])

        await gitUtil.manipularArquivoComCommit(gitFoo, nomeProjetoFoo, '1111111',
            'src/app/spas/foo-controller.js', TIPO_MODIFICACAO.ADDED)
        await gitUtil.manipularArquivoComCommit(gitFoo, nomeProjetoFoo, '1111111',
            'src/app/spas/bar-controller.js', TIPO_MODIFICACAO.ADDED)

        await gitUtil.manipularArquivoComCommit(gitFoo, nomeProjetoFoo, '1111111',
            'bar-controller.html', TIPO_MODIFICACAO.ADDED)
        await gitUtil.manipularArquivoComCommit(gitFoo, nomeProjetoFoo, '1111111',
            'bar-controller.html', TIPO_MODIFICACAO.DELETED)

        await gitUtil.manipularArquivoComCommit(gitFoo, nomeProjetoFoo, '1111111',
            'foo-controller.html', TIPO_MODIFICACAO.ADDED)
        await gitUtil.manipularArquivoComCommit(gitFoo, nomeProjetoFoo, '1111111',
            'foo-controller.html', TIPO_MODIFICACAO.MODIFIED)
        await gitUtil.manipularArquivoComCommit(gitFoo, nomeProjetoFoo, '2222222',
            'foo-controller.html', TIPO_MODIFICACAO.MODIFIED)

        await gitUtil.manipularArquivoComCommit(gitFoo, nomeProjetoFoo, '1111111',
            'config.xml', TIPO_MODIFICACAO.ADDED)

        const lista = await gerador(params).gerarListaArtefato()

        // expect(lista).toHaveLength(1)

        // expect(lista[0].listaNumTarefaSaida).toHaveLength(1)
        // expect(lista[0].listaNumTarefaSaida).toEqual(expect.arrayContaining(['1111111']))
        // expect(lista[0].listaArtefatoSaida).toHaveLength(1)

        // expect(lista[0].listaArtefatoSaida[0].tipoAlteracao).toBe(TIPO_MODIFICACAO.ADDED)
        // expect(lista[0].listaArtefatoSaida[0].numeroAlteracao).toBe(1)
        // expect(lista[0].listaArtefatoSaida[0].nomeArtefato).toMatch(/.*foo-controller.html$/g)
    })
})