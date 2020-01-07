const geradorUtilTest = require('./gerador-util-test')
const gerador = require('../lib/gerador')

const Param = require('../models/param')

const nomeProjeto = 'crm-patrimonio-estatico'
let git, params = {}

describe('test comando bb', () => {

    beforeAll(async () => {

        geradorUtilTest.removerDiretorioTest()

        jest.setTimeout(10000)

        params = new Param({
            autor: "fulano",
            projeto: [
                geradorUtilTest.pathTest() + "/" + nomeProjeto
            ],
            diretorio: geradorUtilTest.pathTest(),
            task: ["1221786"],
            mostrarNumModificacao: true,
            mostrarDeletados: true
        })

        git = await geradorUtilTest.criarRepo(nomeProjeto)

        const lista = [
            'src/app/spas/inventario/bem-services.js',
            'Gruntfile.js',
            'spec/inclusao-ocupante-imovel-controllers-spec.js',
            'src/app/spas/imovel/cadastro/alterar-imovel.tpl.html',
            'src/app/spas/imovel/cadastro/cadastro-imovel-controllers.js',
            'src/app/spas/imovel/cadastro/cadastro-imovel.tpl.html',
            'src/app/spas/imovel/inclusao-ocupante-imovel/inclusao-ocupante-imovel-controllers.js',
        ]

        for (const commit of lista) {
            await geradorUtilTest.manipularArquivoSemCommit(git, nomeProjeto, commit, 'A')
        }

        await geradorUtilTest.commitarProjeto(git, nomeProjeto, '1111111', lista)

        const listaCommit1 = [
            'Gruntfile.js',
            'src/app/spas/imovel/cadastro/alterar-imovel.tpl.html',
            'src/app/spas/imovel/cadastro/cadastro-imovel-controllers.js',
            'src/app/spas/imovel/cadastro/cadastro-imovel.tpl.html',
            'src/app/spas/imovel/inclusao-ocupante-imovel/inclusao-ocupante-imovel-controllers.js'
        ]

        for (const commit of listaCommit1) {
            await geradorUtilTest.manipularArquivoSemCommit(git, nomeProjeto, commit, 'M')
        }

        await geradorUtilTest.commitarProjeto(git, nomeProjeto, '1221786', listaCommit1)

        const listaCommit2 = [
            'src/app/spas/imovel/cadastro/cadastro-imovel-controllers.js',
            'src/app/spas/imovel/cadastro/cadastro-imovel.tpl.html'
        ]

        for (const commit of listaCommit2) {
            await geradorUtilTest.manipularArquivoSemCommit(git, nomeProjeto, commit, 'M')
        }

        await geradorUtilTest.commitarProjeto(git, nomeProjeto, '1221786', listaCommit2)

        const listaCommit3 = [
            'Gruntfile.js',
            'spec/inclusao-ocupante-imovel-controllers-spec.js',
            'src/app/spas/inventario/bem-services.js'
        ]

        await geradorUtilTest.manipularArquivoSemCommit(git, nomeProjeto, listaCommit3[0], 'M')
        await geradorUtilTest.manipularArquivoSemCommit(git, nomeProjeto, listaCommit3[1], 'M')
        await geradorUtilTest.manipularArquivoSemCommit(git, nomeProjeto, listaCommit3[2], 'D')

        await geradorUtilTest.commitarProjeto(git, nomeProjeto, '1221786', listaCommit3)

    })

    it('test gerador sync master', async () => {


        const lista = await gerador(params).gerarListaArtefato()
    });
})