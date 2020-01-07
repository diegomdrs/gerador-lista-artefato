const geradorUtilTest = require('./gerador-util-test')

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
            task: ["1221786"],
            mostrarNumModificacao: true,
            mostrarDeletados: true
        })

        git = await geradorUtilTest.criarRepo(nomeProjeto)

        await foo(git, '1111111', nomeProjeto, [
            { tipoAlteracao: 'A', pathArquivo: 'src/app/spas/inventario/bem-services.js' },
            { tipoAlteracao: 'A', pathArquivo: 'Gruntfile.js' },
            { tipoAlteracao: 'A', pathArquivo: 'spec/inclusao-ocupante-imovel-controllers-spec.js' },
            { tipoAlteracao: 'A', pathArquivo: 'src/app/spas/imovel/cadastro/alterar-imovel.tpl.html' },
            { tipoAlteracao: 'A', pathArquivo: 'src/app/spas/imovel/cadastro/cadastro-imovel-controllers.js' },
            { tipoAlteracao: 'A', pathArquivo: 'src/app/spas/imovel/cadastro/cadastro-imovel.tpl.html' },
            { tipoAlteracao: 'A', pathArquivo: 'src/app/spas/imovel/inclusao-ocupante-imovel/inclusao-ocupante-imovel-controllers.js' }
        ])

        await foo(git, '1221786', nomeProjeto, [
            { tipoAlteracao: 'M', pathArquivo: 'Gruntfile.js' },
            { tipoAlteracao: 'M', pathArquivo: 'src/app/spas/imovel/cadastro/alterar-imovel.tpl.html' },
            { tipoAlteracao: 'M', pathArquivo: 'src/app/spas/imovel/cadastro/cadastro-imovel-controllers.js' },
            { tipoAlteracao: 'M', pathArquivo: 'src/app/spas/imovel/cadastro/cadastro-imovel.tpl.html' },
            { tipoAlteracao: 'M', pathArquivo: 'src/app/spas/imovel/inclusao-ocupante-imovel/inclusao-ocupante-imovel-controllers.js' }
        ])

        await foo(git, '1221786', nomeProjeto, [
            { tipoAlteracao: 'M', pathArquivo: 'src/app/spas/imovel/cadastro/cadastro-imovel-controllers.js' },
            { tipoAlteracao: 'M', pathArquivo: 'src/app/spas/imovel/cadastro/cadastro-imovel.tpl.html' }
        ])

        await foo(git, '1221786', nomeProjeto, [
            { tipoAlteracao: 'M', pathArquivo: 'Gruntfile.js' },
            { tipoAlteracao: 'M', pathArquivo: 'spec/inclusao-ocupante-imovel-controllers-spec.js' },
            { tipoAlteracao: 'D', pathArquivo: 'src/app/spas/inventario/bem-services.js' }
        ])
    })

    it('test gerador sync master', async () => {

        const params = {
            autor: "fulano",
            diretorio: geradorUtilTest.pathTest() + '/' + nomeProjeto,
            projeto: [ nomeProjeto ],
            task: ['1221786'],
            mostrarNumModificacao: true,
            mostrarDeletados: true
        }
        
        const gerador = require('../lib/gerador')
        const lista = await gerador(params).gerarListaArtefato()
    });

    async function foo(git, tarefa, nomeProjeto, listaArquivo) {
        for (const arquivo of listaArquivo) {
            await geradorUtilTest.manipularArquivoSemCommit(git, nomeProjeto,
                arquivo.pathArquivo, arquivo.tipoAlteracao)
        }

        await geradorUtilTest.commitarProjeto(git, nomeProjeto, tarefa, listaArquivo)
    }
})