angular
    .module('geradorApp')
    .component('alert', alert())

function alert() {

    return {
        bindings: {
            alerts: '<',
        },
        templateUrl: 'components/alert.tpl.html',
        controllerAs: 'vm'
    }
}