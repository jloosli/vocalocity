app.factory('directoryFactory', function ($http, $q) {
    var factory = {};
    var directory = [{name: "Test", ext: "123"}];

    factory.getItem = function(index) { return directory[index]; }
    factory.addItem = function(item) { directory.push(item); }
    factory.removeItem = function(item) { directory.splice(list.indexOf(item), 1) }
    factory.size = function() { return directory.length; }

    factory.authenticate = function () {
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

                })
                .error(function (data, status, headers, config) {
                    var i;
                    for (i in headers) {
                        console.log(i);
                        console.log(headers[i]);
                    }
                });

        });
    }


    //init();

    function init() {
        this.factory.authenticate();
        $http({
            method: 'GET',
            url: 'https://dashboard.vocalocity.com/presence/rest/directory'

        })
            .success(function (data, status, headers, config) {
                angular.forEach(data.extensions, function (value, key) {
                    value['ext'] = key;
                    this.push(value);
                }, this.directory);
                console.log('directory success');
            })
            .error(function (data, status, headers, config) {
                console.log('directory fail');
                //@todo show error
            })
    }


    factory.getDirectory = function () {
        return $http.get('https://dashboard.vocalocity.com/presence/rest/directory').then(function (results) {
            var listData = [];
            angular.forEach(results.data.extensions, function (value, key) {
                value['ext'] = key;
                this.push(value);
            }, listData);
            console.log(listData);
                return listData; //results.data.extensions;
            });
    };
    return factory;

});

