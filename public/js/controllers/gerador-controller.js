angular
    .module('geradorApp')
    .controller('GeradorController', GeradorController);

GeradorController.$inject = ['geradorService'];

function GeradorController(geradorService) {
    var vm = this

    vm.listaSaida = []
    vm.req = {}

    vm.init = init
    vm.obterNumero = obterNumero
    vm.adicionarCaminhoProjeto = adicionarCaminhoProjeto
    vm.removerCaminhoProjeto = removerCaminhoProjeto
    vm.adicionarTask = adicionarTask
    vm.removerTask = removerTask

    // vm.req = {
    //     diretorio: "/home/foo/Documents/gerador-lista-artefato-qas/test/gerador-lista-artefato-qas",
    //     autor: "fulano",
    //     projeto: ["apc-estatico", "apc-api", "crm-patrimonio-estatico", "crm-patrimonio-api"],
    //     task: ["1168815", "1172414", "1168800", "1167319", "1163642", "1155478", "1150152", "1161422"]
    // }

    vm.req = {
        diretorio: "/home/foo/Documents/gerador-lista-artefato-qas/test/gerador-lista-artefato-qas",
        autor: "fulano",
        projeto: [],
        task: []
    }

    function init() {

        limparMessages()

        geradorService.gerarListaArtefato(vm.req)
            .then(function (resposta) {
                vm.listaSaida = resposta.data
            }, function (error) {

                vm.messages = [error.data.message]
            })
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

        if (vm.task) {

            const lista = vm.req.task.filter((task) => task === vm.task)

            if(lista.length) {

                vm.messages = ['A tarefa ' + vm.task + ' já existe na lista' ]

            } else {
    
                vm.req.task.push(vm.task)
                delete vm.task   
            }
        }
    }

    function adicionarCaminhoProjeto() {

        limparMessages()

        if (vm.caminhoProjeto) {

            const lista = vm.req.projeto.filter((projeto) => projeto === vm.caminhoProjeto)

            if(lista.length) {

                vm.messages = ['O caminho ' + vm.caminhoProjeto + ' já existe na lista de projeto' ]

            } else {
    
                vm.req.projeto.push(vm.caminhoProjeto)
                delete vm.caminhoProjeto   
            }
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
}