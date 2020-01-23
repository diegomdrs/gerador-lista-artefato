angular
    .module('geradorApp')
    .controller('GeradorController', GeradorController)

GeradorController.$inject = ['geradorService', 'blockUI', '$timeout', 'geradorUtil', 'geradorConstants'];

function GeradorController(geradorService, blockUI, $timeout, geradorUtil, geradorConstants) {
    var vm = this

    vm.listaSaida = []
    vm.req = {}

    vm.TIPO_ALERTA = geradorConstants.TIPO_ALERTA
    vm.TIPO_MODIFICACAO = geradorConstants.TIPO_MODIFICACAO

    vm.init = init
    vm.listarArtefatos = listarArtefatos
    vm.limparFiltros = limparFiltros
    vm.closeMessage = closeMessage

    vm.obterNumero = obterNumero
    vm.adicionarCaminhoProjeto = adicionarCaminhoProjeto
    vm.removerCaminhoProjeto = removerCaminhoProjeto
    vm.adicionarTask = adicionarTask
    vm.removerTask = removerTask
    vm.obterNomeProjeto = obterNomeProjeto
    vm.obterNomeArtefato = obterNomeArtefato
    vm.copiarLinhaTabelaClipboard = copiarLinhaTabelaClipboard
    vm.copiarTabelaClipboardTabulado = copiarTabelaClipboardTabulado

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
                        ('Nenhum resultado encontrado', vm.alerts)

                }).catch((error) => {

                    adicionarMensagemErro(error.data.message, vm.alerts)
                    vm.listaSaida = []

                }).finally(() => blockUI.stop())

        } else {

            !vm.req.task.length && adicionarMensagemErro
                ('Adicione ao menos uma tarefa ao filtro', vm.alerts)

            !vm.req.projeto.length && adicionarMensagemErro
                ('Adicione ao menos um projeto ao filtro', vm.alerts)
        }
    }

    function obterNumero(saida) {

        if (saida.listaArtefatoSaida.length === 1) {

            return saida.listaNumTarefaSaida.length

        } else {

            return saida.listaArtefatoSaida.length
        }
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

                const contemTarefa = vm.req.task.some((task) => {
                    task === tarefa
                })

                !contemTarefa && vm.req.task.push(tarefa)
            }

            delete vm.tarefa
        }
    }

    function adicionarCaminhoProjeto() {

        limparMessages()

        if (vm.caminhoProjeto) {

            const listaProjeto = vm.caminhoProjeto.split(',')

            for (const projeto of listaProjeto) {

                const contemProjeto = vm.req.projeto.some((projetoSome) => {
                    projeto.trim() === projetoSome
                })

                !contemProjeto && vm.req.projeto.push(projeto.trim())
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
        vm.alertsTop = []
    }

    function adicionarMensagemSucesso(mensagem, alerts) {
        adicionarMensagem(vm.TIPO_ALERTA.SUCCESS, mensagem, alerts)
    }

    function adicionarMensagemErro(mensagem, alerts) {
        adicionarMensagem(vm.TIPO_ALERTA.ERROR, mensagem, alerts)
    }

    function adicionarMensagem(tipoAlerta, mensagem, alerts) {

        const message = {
            tipoAlerta: tipoAlerta,
            text: mensagem,
            close: function () {
                alerts.splice(
                    alerts.indexOf(this), 1);
            }
        }

        alerts.push(message)

        $timeout(function () {
            message.close();
        }, geradorConstants.TIMEOUT_ALERTA)
    }

    function limparFiltros() {

        limparMessages()

        vm.req = {
            autor: 'fulano',
            projeto: [
                '/tmp/gerador-lista-artefato-qas/bar-estatico',
                '/tmp/gerador-lista-artefato-qas/bar-api',
                '/tmp/gerador-lista-artefato-qas/qux-estatico',
                '/tmp/gerador-lista-artefato-qas/qux-api'
            ],
            task: ["1168815", "1172414", "1168800", "1167319", "1163642", "1155478", "1150152", "1161422"],
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

    function closeMessage(index) {
        vm.alerts.splice(index, 1);
    }

    function obterNomeArtefato(artefato) {

        if (artefato.tipoAlteracao === 'R') {

            return artefato.nomeAntigoArtefato + ' ' + artefato.nomeNovoArtefato

        } else {

            return artefato.nomeArtefato
        }
    }

    function copiarTabelaClipboardTabulado() {

        limparMessages()

        geradorUtil.copiarTabelaClipboardTabulado(vm.listaSaida)

        adicionarMensagemSucesso('Tabela copiada para o clipboard', vm.alertsTop)
    }

    function copiarLinhaTabelaClipboard(saida) {

        limparMessages()

        geradorUtil.copiarTabelaClipboardTabulado([saida])

        adicionarMensagemSucesso('Linha copiada para o clipboard', vm.alertsTop)
    }
}