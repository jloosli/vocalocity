app.factory('directoryFactory', function ($http, $q) {
    var factory = {};
    var directory = [];

    factory.getItem = function(index) { return directory[index]; }
    factory.addItem = function(item) { directory.push(item); }
    factory.removeItem = function(item) { directory.splice(list.indexOf(item), 1) }
    factory.size = function() { return directory.length; }

    //init();

    function init() {
        $http({
            method: 'GET',
            url: 'https://dashboard.vocalocity.com/presence/rest/directory'

        })
            .success(function (data, status, headers, config) {
                console.log('directory success');
                directory = data.extensions;
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

