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

    vm.req = {
        diretorio: "/home/foo/Documents/gerador-lista-artefato-qas/test/gerador-lista-artefato-qas",
        autor: "fulano",
        projeto: ["apc-estatico", "apc-api", "crm-patrimonio-estatico", "crm-patrimonio-api"],
        task: ["1168815", "1172414", "1168800", "1167319", "1163642", "1155478", "1150152", "1161422"]
    }

    function init() {

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
}