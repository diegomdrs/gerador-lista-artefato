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

    vm.$onChanges = function (changes) {

        vm.alertsFoo = foo()

        console.log(changes)
        console.log(vm.alertsFoo)
    }

    function foo() {

        return vm.alerts.reduce((accum, alert) => {

            alert.close = () =>
                accum.splice(accum.indexOf(this), 1)

            $timeout(() => alert.close(),
                geradorConstants.TIMEOUT_ALERTA)

            accum.push(alert)

            return accum
        }, [])
    }
}