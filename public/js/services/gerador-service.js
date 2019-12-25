angular
    .module('geradorApp')
    .factory('geradorService', geradorService)

geradorService.$inject = ['$http']

function geradorService($http) {

    const service = {
        gerarListaArtefato: gerarListaArtefato
    }

    function gerarListaArtefato(req) {

        return $http({
            method: 'POST',
            url: 'http://localhost:3000/gerarListaArtefato',
            data: req
        })
    }

    return service
}