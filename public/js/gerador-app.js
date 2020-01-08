angular
	.module('geradorApp', [
		'ngRoute',
		'ngResource',
		'blockUI']
	)
	.config(configure);

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
		templateUrl: 'partials/gerador.html',
		controller: 'GeradorController'
	})

	$routeProvider.otherwise({ redirectTo: '/gerador' })

	blockUIConfig.message = 'Aguarde';
}