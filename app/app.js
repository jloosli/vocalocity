var app = angular.module('vocalocityApp', []);

app.config(function ($routeProvider) {
    $routeProvider
        .when('/',
        {
            controller: 'vocalocityController',
            templateUrl: '/app/partials/dialer.html'

        })
        .otherwise({redirectTo: '/'});
});