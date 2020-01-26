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

alertController.$inject = ['geradorConstants', '$timeout']

function alertController(geradorConstants, $timeout) {

    const vm = this;

    vm.$onChanges = function () {

        vm.alertsFoo = vm.alerts.filter((alert) =>
            alert.tipoFoo === geradorConstants.TIPO_FOO.DEFAULT
        ).map((alert) => {

            alert.close = () =>
                vm.alertsFoo.splice(vm.alertsFoo.indexOf(this), 1)

            $timeout(() => alert.close(),
                geradorConstants.TIMEOUT_ALERTA)

            return alert
        })

        vm.alertsFooTop = vm.alerts.filter((alert) =>
            alert.tipoFoo === geradorConstants.TIPO_FOO.TOP
        ).map((alert) => {

            alert.close = () =>
                vm.alertsFooTop.splice(vm.alertsFooTop.indexOf(this), 1)

            $timeout(() => alert.close(),
                geradorConstants.TIMEOUT_ALERTA)

            return alert
        })
    }
}