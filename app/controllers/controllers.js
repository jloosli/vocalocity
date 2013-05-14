/**
 * Created with JetBrains PhpStorm.
 * User: jloosli
 * Date: 5/13/13
 * Time: 2:39 PM
 * To change this template use File | Settings | File Templates.
 */
app.controller('vocalocityController', function ($scope, $http, $cookies) {

    var storage = chrome.storage.sync;

    init();

    function init() {
        authenticate();
        getDirectory();
    }

    $scope.dialNumber = function () {
        console.log("Dialing " + phoneNumber);
        $http({
            method: 'GET',
            url: 'https://dashboard.vocalocity.com/presence/rest/clicktocall/' + phoneNumber
        })
            .success(function (data, status, headers, config) {
                console.log("Dialed " + phoneNumber + " successfully.");
            })
            .error(function (data, status, headers, config) {
                console.log("Dialer error")
            });
    }


    $scope.addNumber = function () {
        $scope.search = this.ext;
    }

    function authenticate() {
        storage.get(['username', 'password'], function (loginInfo){
            $http({
                method: 'GET',
                url: 'https://dashboard.vocalocity.com/appserver/rest/user/null',
                headers: {
                    login: loginInfo.username,
                    password: loginInfo.password
                }
            })
                .success(function (data, status, headers, config) {
                    console.log(data);

                })
                .error(function (data, status, headers, config) {
                    for (i in headers) {
                        console.log(i);
                        console.log(headers[i]);
                    }
                });

        });
    }

    function getDirectory() {
        $http({
            method: 'GET',
            url: 'https://dashboard.vocalocity.com/presence/rest/directory'

        })
            .success(function (data, status, headers, config) {
                console.log('directory success');
                $scope.directory = data.extensions;
            })
            .error(function (data, status, headers, config) {
                console.log('directory fail');
                //@todo show error
            })
    }

});

