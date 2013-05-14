var app = angular.module('vocalocityApp', ['ngCookies']);

app.config(function ($routeProvider, $locationProvider) {
    $routeProvider
        .when('/',
        {
            controller: 'vocalocityController',
            templateUrl: '/app/partials/dialer.html'

        })
        .when('/settings',
        {
            controller: 'settingsController',
            templateUrl: '/app/partials/settings.html'
        })
        .otherwise({redirectTo: '/'});

    $locationProvider.html5Mode(true);
});

app.filter('directoryToList', function () {
    return function (directory) {
        return Object.keys(directory);
    }
})