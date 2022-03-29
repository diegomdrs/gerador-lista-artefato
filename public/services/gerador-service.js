angular
    .module('geradorApp')
    .factory('geradorService', geradorService)

geradorService.$inject = ['$http']

function geradorService($http) {

    const PORT = 3333
    const HOST = 'localhost'

    const service = {
        gerarListaArtefato,
        listarDiretorio,
        obterListaArtefatoCsv,
        verificarUltimaVersaoApp,
        obterVersaoApp
    }

    function obterVersaoApp() {

        return $http({
            method: 'GET',
            url: `http://${HOST}:${PORT}/obterVersaoApp`
        })
    }

    function verificarUltimaVersaoApp() {

        return $http({
            method: 'GET',
            url: `http://${HOST}:${PORT}/verificarUltimaVersaoApp`
        })
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