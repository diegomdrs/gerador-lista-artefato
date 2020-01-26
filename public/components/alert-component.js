angular
    .module('geradorApp')
    .component('alert', alert())

function alert() {

    return {
        templateUrl: 'components/alert.tpl.html'
    }
}