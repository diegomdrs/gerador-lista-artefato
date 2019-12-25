angular
    .module('geradorApp')
    .controller('GeradorController', GeradorController);

GeradorController.$inject = ['geradorService'];

function GeradorController(geradorService) {
    var vm = this

    vm.listaSaida = []

    vm.init = init

    function init() {

        const req = {
            diretorio: "/home/foo/Documents/gerador-lista-artefato-qas/test/gerador-lista-artefato-qas",
            autor: "fulano",
            projeto: ["apc-estatico", "apc-api", "crm-patrimonio-estatico", "crm-patrimonio-api"],
            task: ["1168815", "1172414", "1168800", "1167319", "1163642", "1155478", "1150152", "1161422"]
        }

        geradorService.gerarListaArtefato(req)
            .then(function (resposta) {
                vm.listaSaida = resposta.data

            })
    }
}