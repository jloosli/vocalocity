/**
 * Created with JetBrains PhpStorm.
 * User: jloosli
 * Date: 5/13/13
 * Time: 2:39 PM
 * To change this template use File | Settings | File Templates.
 */
app.controller('dialerController', function ($scope, $http, $cookies, $filter, directoryFactory) {


    $scope.directory = directoryFactory.getDirectory();

//    $scope.$watch('query', function(newVal,oldVal) {
//        $scope.filteredQuery = $filter('filter')($scope.directory, $scope.query);
//        console.log($scope.query);
//        console.log($scope.filteredQuery);
//
//    });


    $scope.dialNumber = function (phoneNumber) {
        console.log("Dialing " + phoneNumber);
        $http({
            method: 'GET',
            url: 'https://dashboard.vocalocity.com/presence/rest/clicktocall/' + phoneNumber
        })
            .success(function (data, status, headers, config) {
                $scope.alertMessage= "Dialed " + phoneNumber + " successfully.";
                setTimeout(function() {
                    $scope.alertMessage = '';
                },2000)
            })
            .error(function (data, status, headers, config) {
                console.log("Dialer error")
            });
    }


    $scope.addNumber = function () {
        console.log(this);
        $scope.query = this.details.ext;
    }


});

app.controller('settingsController', function ($scope,$location) {
    var storage = chrome.storage.sync;

    storage.get(['username','password'], function (user) {
        $scope.user=user;
    });
    $scope.saveSettings = function (user) {
        console.log(user);
        storage.set({username: user.username, password: user.password});
        $location.url('/');

    }


});

app.controller('menuController', function($scope, $location) {
    $scope.getClass = function (path) {
        return $location.path() == path;
    }
});