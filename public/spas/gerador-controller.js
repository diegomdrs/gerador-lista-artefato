angular
    .module('geradorApp')
    .controller('GeradorController', GeradorController)

GeradorController.$inject = ['geradorService', 'blockUI', 'clipboardUtil', 'geradorConstants'];

function GeradorController(geradorService, blockUI, clipboardUtil, geradorConstants) {
    var vm = this

    vm.listaSaida = []
    vm.req = {}

    vm.TIPO_ALERTA = geradorConstants.TIPO_ALERTA
    vm.TIPO_MODIFICACAO = geradorConstants.TIPO_MODIFICACAO

    vm.init = init
    vm.listarArtefatos = listarArtefatos
    vm.limparFiltros = limparFiltros

    vm.obterNumero = obterNumero
    vm.adicionarCaminhoProjeto = adicionarCaminhoProjeto
    vm.removerCaminhoProjeto = removerCaminhoProjeto
    vm.adicionarTask = adicionarTask
    vm.removerTask = removerTask
    vm.obterNomeProjeto = obterNomeProjeto
    vm.obterNomeArtefato = obterNomeArtefato
    vm.copiarLinhaTabelaClipboard = copiarLinhaTabelaClipboard
    vm.copiarTabelaPlainTextClipboard = copiarTabelaPlainTextClipboard
    vm.copiarTabelaClipboard = copiarTabelaClipboard

    function init() {

        limparMessages()
        limparFiltros()
    }

    function listarArtefatos() {

        limparMessages()

        if (vm.req.task.length && vm.req.projeto.length) {

            blockUI.start()

            geradorService.gerarListaArtefato(vm.req)
                .then((resposta) => {

                    vm.listaSaida = resposta.data

                    !vm.listaSaida.length && adicionarMensagemErro
                        ('Nenhum resultado encontrado', geradorConstants.TIPO_POSICAO_ALERT.DEFAULT)

                }).catch((error) => {

                    adicionarMensagemErro(error.data.message,
                        geradorConstants.TIPO_POSICAO_ALERT.DEFAULT)

                    vm.listaSaida = []

                }).finally(() => blockUI.stop())

        } else {

            !vm.req.task.length && adicionarMensagemErro
                ('Adicione ao menos uma tarefa ao filtro', geradorConstants.TIPO_POSICAO_ALERT.DEFAULT)

            !vm.req.projeto.length && adicionarMensagemErro
                ('Adicione ao menos um projeto ao filtro', geradorConstants.TIPO_POSICAO_ALERT.DEFAULT)
        }
    }

    function obterNumero(saida) {

        if (saida.listaArtefatoSaida.length === 1)
            return saida.listaNumTarefaSaida.length
        else 
            return saida.listaArtefatoSaida.length
    }

    function removerTask(taskRemocao) {

        limparMessages()

        vm.req.task = vm.req.task.filter(task =>
            task !== taskRemocao)
    }

    function adicionarTask() {

        limparMessages()

        if (vm.tarefa) {

            const listaTarefa = vm.tarefa.split(',')

            for (const tarefa of listaTarefa) {

                const contemTarefa = vm.req.task.some((task) => 
                    task === tarefa)

                if(!contemTarefa)
                    vm.req.task.push(tarefa)
                else 
                    adicionarMensagemErro(`${tarefa} já consta na lista de tarefas`,
                        geradorConstants.TIPO_POSICAO_ALERT.DEFAULT)
            }

            delete vm.tarefa
        }
    }

    function adicionarCaminhoProjeto() {

        limparMessages()

        if (vm.caminhoProjeto) {

            const listaProjeto = vm.caminhoProjeto.split(',')

            for (const projeto of listaProjeto) {

                const contemProjeto = vm.req.projeto.some((projetoSome) => 
                    projeto.trim() === projetoSome)

                if(!contemProjeto) 
                    vm.req.projeto.push(projeto.trim())
                else 
                    adicionarMensagemErro(`${projeto.trim()} já consta na lista de projetos`,
                        geradorConstants.TIPO_POSICAO_ALERT.DEFAULT)
            }

            delete vm.caminhoProjeto
        }
    }

    function removerCaminhoProjeto(caminhoRemocao) {

        limparMessages()

        vm.req.projeto = vm.req.projeto.filter(caminho =>
            caminho !== caminhoRemocao)
    }

    function limparMessages() {

        vm.alerts = []
    }

    function adicionarMensagemSucesso(mensagem, tipoFoo) {
        adicionarMensagem(vm.TIPO_ALERTA.SUCCESS, mensagem, tipoFoo)
    }

    function adicionarMensagemErro(mensagem, tipoFoo) {
        adicionarMensagem(vm.TIPO_ALERTA.ERROR, mensagem, tipoFoo)
    }

    function adicionarMensagem(tipoAlerta, mensagem, tipoFoo) {

        const message = {
            tipoAlerta: tipoAlerta,
            text: mensagem,
            tipoFoo: tipoFoo,
        }

        vm.alerts.push(message)
    }

    function limparFiltros() {

        limparMessages()

        vm.req = {
            projeto: [],
            task: [],
            mostrarDeletados: false,
            mostrarRenomeados: false
        }

        delete vm.listaSaida
        delete vm.caminhoProjeto
        delete vm.tarefa
    }

    function obterNomeProjeto(caminhoProjeto) {

        return caminhoProjeto.match(/([^/|\\]*)$/g)[0]
    }

    function obterNomeArtefato(artefato) {

        return (artefato.tipoAlteracao === 'R')
            ? artefato.nomeAntigoArtefato + ' ' + artefato.nomeNovoArtefato
            : artefato.nomeArtefato
    }

    function copiarTabelaPlainTextClipboard() {

        limparMessages()

        clipboardUtil.copiarTabelaClipboard(vm.listaSaida)

        adicionarMensagemSucesso('Dados da tabela copiado para o clipboard',
            geradorConstants.TIPO_POSICAO_ALERT.TOP)
    }

    function copiarTabelaClipboard() {

        limparMessages()

        clipboardUtil.copiarTabelaClipboardTabulado(vm.listaSaida)

        adicionarMensagemSucesso('Dados da tabela copiado para o clipboard',
            geradorConstants.TIPO_POSICAO_ALERT.TOP)
    }

    function copiarLinhaTabelaClipboard(saida) {

        limparMessages()

        clipboardUtil.copiarTabelaClipboard([saida])

        adicionarMensagemSucesso('Dados da linha copiado para o clipboard',
            geradorConstants.TIPO_POSICAO_ALERT.TOP)
    }
}