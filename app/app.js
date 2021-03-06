var app = angular.module('vocalocityApp', ['ngCookies']);

app.config(function ($routeProvider, $locationProvider) {
    $routeProvider
        .when('/',
        {
            controller: 'dialerController',
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

