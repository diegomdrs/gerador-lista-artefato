angular
    .module('geradorApp')
    .controller('GeradorController', GeradorController)

GeradorController.$inject = ['geradorService', 'blockUI', '$timeout', 'geradorUtil'];

function GeradorController(geradorService, blockUI, $timeout, geradorUtil) {
    var vm = this

    vm.listaSaida = []
    vm.req = {}

    vm.TIPO_ALERTA = {
        SUCCESS: { class: 'alert-success', icone: '✓' },
        ERROR: { class: 'alert-danger', icone: '✗' },
    }

    const TIMEOUT_ALERTA = 2500

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
                .then(function (resposta) {

                    vm.listaSaida = resposta.data

                    !vm.listaSaida.length && adicionarMensagemErro
                        ('Nenhum resultado encontrado', vm.alerts)

                }).catch(function (error) {

                    adicionarMensagemErro(error.data.message, vm.alerts)
                    vm.listaSaida = []

                }).finally(function () {

                    blockUI.stop()
                })

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
        }, TIMEOUT_ALERTA)
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

            // projeto: [
            //     '/kdi/git/apc-api',
            //     '/kdi/git/apc-estatico',
            //     '/kdi/git/crm-patrimonio-estatico',
            //     '/kdi/git/crm-patrimonio-api',
            //     '/kdi/git/fti-estatico'
            // ],

            task: ["1168815", "1172414", "1168800", "1167319", "1163642", "1155478", "1150152", "1161422"],

            // task: ["1199211", "1203082", "1203670", "1207175", "1210684", "1210658", "1212262", "1212444"],
            // task: ["1239662", "1221786", "1234921", "1229100", "1227471", "1226285", "1221172", "1217966", "1215554"],
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

    function copiarTabelaClipboard() {

        limparMessages()

        geradorUtil.copiarTabelaClipboard(vm.listaSaida)

        adicionarMensagemSucesso('Tabela copiada para o clipboard', vm.alertsTop)
    }

    function copiarLinhaTabelaClipboard(saida) {

        limparMessages()

        geradorUtil.copiarTabelaClipboard([saida])

        adicionarMensagemSucesso('Linha copiada para o clipboard', vm.alertsTop)
    }
}