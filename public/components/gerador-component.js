angular
    .module('geradorApp')
    .component('alert', alert)
    .controller('FooController', fooController)

function alert() {

    return {
        bindings: {
            listaFoos: '<',
            indicadorContinuidade: '@',
            carregarProximosRegistros: '&'
        },
        controller: fooController,
        templateUrl: 'foo.tpl.html',
        controllerAs: 'vm'
    };

    function fooController() {

        var vm = this;
    }
}