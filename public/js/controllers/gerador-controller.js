angular
    .module('geradorApp')
    .controller('GeradorController', GeradorController);

GeradorController.$inject = ['geradorService'];

function GeradorController(geradorService) {
    var vm = this;

    init()

    async function init() {

        const req = {
            diretorio: "/home/foo/Documents/gerador-lista-artefato-qas/test/gerador-lista-artefato-qas",
            autor: "fulano",
            projeto: ["apc-estatico", "crm-patrimonio-estatico"],
            task: ["1199211", "1203082", "1203670", "1207175", "1210684", "1210658", "1212262", "1212444"]
        }

        const resposta = await geradorService.gerarListaArtefato(req)

        console.log(resposta)
    }
}