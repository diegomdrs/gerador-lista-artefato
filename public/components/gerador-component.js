angular
    .module('geradorApp')
    .component('alertComponent', alertComponent)
    .controller('FooController', fooController)

function alertComponent() {

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