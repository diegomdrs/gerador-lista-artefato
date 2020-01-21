angular
    .module('geradorApp')
    .factory('geradorService', geradorService)

geradorService.$inject = ['$http']

function geradorService($http) {

    const PORT = 3333
    const HOST = 'localhost'

    const service = {
        gerarListaArtefato: gerarListaArtefato
    }

    function gerarListaArtefato(req) {

        return $http({
            method: 'POST',
            url: `http://${HOST}:${PORT}/gerarListaArtefato`,
            data: req
        })
    }

    return service
}