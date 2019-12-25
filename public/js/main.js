angular
	.module('gerador', [])
	.config(configure);

configure.$inject = ['$routeProvider', '$locationProvider'];

function configure($routeProvider, $locationProvider) {

	$locationProvider.html5Mode(true)

	$routeProvider.when('/gerador', {
		templateUrl: 'partials/gerador.html',
		controller: 'GeradorController'
	})

	$routeProvider.otherwise({ redirectTo: '/gerador' })
}