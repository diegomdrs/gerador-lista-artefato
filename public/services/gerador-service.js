angular
    .module('geradorApp')
    .factory('geradorService', geradorService)

geradorService.$inject = ['$http']

function geradorService($http) {

    const PORT = 3333
    const HOST = 'localhost'

    const service = {
        gerarListaArtefato: gerarListaArtefato,
        listarDiretorio: listarDiretorio,
        obterListaArtefatoCsv: obterListaArtefatoCsv
    }

    function gerarListaArtefato(req) {

        return $http({
            method: 'POST',
            url: `http://${HOST}:${PORT}/gerarListaArtefato`,
            data: req
        })
    }

    function listarDiretorio(req) {

        return $http({
            method: 'POST',
            url: `http://${HOST}:${PORT}/listarDiretorio`,
            data: req
        })
    }

    function obterListaArtefatoCsv(req) {

        return $http({
            method: 'POST',
            url: `http://${HOST}:${PORT}/obterListaArtefatoCsv`,
            data: req
        })
    }


    return service
}