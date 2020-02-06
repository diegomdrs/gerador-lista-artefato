angular
    .module('geradorApp')
    .component('alert', alert())
    .controller('AlertController', alertController)

function alert() {
    return {
        bindings: {
            alerts: '<',
        },
        templateUrl: 'components/alert.tpl.html',
        controller: alertController,
        controllerAs: 'vm'
    }
}

function alertController() {

    const vm = this;

    vm.$onInit = () =>
        alertsPrevious = angular.copy(vm.alerts)

    vm.$doCheck = () => {

        if (!angular.equals(vm.alerts, alertsPrevious)) {
            for (const alert of vm.alerts) {

                alert.close = () => {
                    vm.alerts.splice(vm.alerts.indexOf(this), 1)
                }
            }
        }

        alertsPrevious = angular.copy(vm.alerts)
    }
}