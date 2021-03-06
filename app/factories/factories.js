app.factory('directoryFactory', function ($http, $rootScope, $q) {
    var self = this;
    var factory = {};
    factory.directory = [];
//    factory.directory = [
//        {name: "Test", ext: "123"},
//        {name: 'Bob', ext: "234"}
//    ];
    var storage = chrome.storage.sync;

    factory.getItem = function (index) {
        return factory.directory[index];
    }
    factory.addItem = function (item) {
        factory.directory.push(item);
    }
    factory.removeItem = function (item) {
        factory.directory.splice(factory.directory.indexOf(item), 1)
    }
    factory.size = function () {
        return factory.directory.length;
    }

    var authenticate = function () {
        var deferred = $q.defer();
        storage.get(['username', 'password'], function (loginInfo) {
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
                    deferred.resolve();
                })
                .error(function (data, status, headers, config) {
                    var i;
                    for (i in headers) {
                        console.log(i);
                        console.log(headers[i]);
                    }
                    deferred.reject();
                });

        });
        return deferred.promise;
    }


    init();

    function init() {
        var promise = authenticate();
        promise.then(function () {
            $http({
                method: 'GET',
                url: 'https://dashboard.vocalocity.com/presence/rest/directory'

            })
                .success(function (data, status, headers, config) {
                    var tempDir = [];
                    console.log(factory.directory);
                    angular.forEach(data.extensions, function (value, key) {
                        if (value['loginName']) {
                            value['ext'] = key;
                            this.push(value);
                        }
                    }, tempDir);
                    factory.directory = tempDir;
                    $rootScope.$broadcast('data-updated', true);
                    console.log(factory.directory);
                    console.log('directory success');
                })
                .error(function (data, status, headers, config) {
                    console.log('directory fail');
                    //@todo show error
                });
        });
    }


    factory.getDirectory = function () {
        return this.directory;
    };
    return factory;

});

