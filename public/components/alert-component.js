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

        vm.alerts.forEach((alert) => {

            alert.close = ($index) => {

                console.log('$index ' + $index)
                console.log('vm.alerts ' + JSON.stringify(vm.alerts))

                vm.alerts.splice($index, 1)
            }

            // $timeout(() => alert.close(),
            //     geradorConstants.TIMEOUT_ALERTA)
        })
    }
}