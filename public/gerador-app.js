angular
	.module('geradorApp',
		[
			'ngRoute',
			'ngResource',
			'blockUI',
			'ng.deviceDetector',
			'ngFileSaver',
			'angular.filter'

		]).config(configure);

configure.$inject = [
	'$routeProvider',
	'$locationProvider',
	'blockUIConfig'
];

function configure(
	$routeProvider,
	$locationProvider,
	blockUIConfig) {

	$locationProvider.html5Mode(true)

	$routeProvider.when('/gerador', {
		templateUrl: 'spas/gerador.tpl.html',
		controller: 'GeradorController'
	})

	$routeProvider.otherwise({ redirectTo: '/gerador' })

	blockUIConfig.message = 'Aguarde';
}