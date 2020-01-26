angular
    .module('geradorApp')
    .component('alert', alert())

function alert() {

    return {
        bindings: {
            alerts: '<',
            alertsTop: '<'
        },
        templateUrl: 'components/alert.tpl.html',
        controllerAs: 'vm'
    }
}