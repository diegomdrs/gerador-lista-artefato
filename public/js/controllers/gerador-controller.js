angular
    .module('geradorApp')
    .controller('GeradorController', GeradorController)

GeradorController.$inject = ['geradorService', 'blockUI'];

function GeradorController(geradorService, blockUI) {
    var vm = this

    vm.listaSaida = []
    vm.req = {}

    vm.TIPO_MODIFICACAO = {
        A: 'Criado',
        M: 'Alterado',
        R: 'Renomeado',
        D: 'Deletado'
    }

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

                    !vm.listaSaida.length && adicionarMensagem
                        ('Nenhum resultado encontrado')

                }).catch(function (error) {

                    vm.messages = [error.data.message]
                    vm.listaSaida = []

                }).finally(function () {

                    blockUI.stop()
                })

        } else {

            !vm.req.task.length && adicionarMensagem
                ('Adicione ao menos uma tarefa ao filtro')

            !vm.req.projeto.length && adicionarMensagem
                ('Adicione ao menos um projeto ao filtro')
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

        vm.messages = []
    }

    function adicionarMensagem(mensagem) {
        vm.messages.push(mensagem)
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

    function closeMessage(index) {
        vm.messages.splice(index, 1);
    }

    function obterNomeArtefato(artefato) {

        if (artefato.tipoAlteracao === 'R') {

            return artefato.nomeAntigoArtefato + ' ' + artefato.nomeNovoArtefato

        } else {

            return artefato.nomeArtefato
        }
    }
}