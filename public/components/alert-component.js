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

    // vm.$doCheck = function () {

    //     foo()
    // }

    vm.$onChanges = function () {

        foo()
    }

    function foo() {

        if (vm.alerts.length) {

            vm.alerts.forEach((alert) => {

                alert.close = () =>
                    vm.alerts.splice(vm.alerts.indexOf(this), 1)

                // $timeout(() => alert.close(),
                //     geradorConstants.TIMEOUT_ALERTA)
            })
        }
    }
}