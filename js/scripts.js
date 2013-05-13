// Copyright (c) 2013 Avanti Development, LLC. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

var storage = chrome.storage.sync;

var vocalocity = {

    urls: {
        getCookie: "https://my.vocalocity.com/appserver/rest/user/null",
        clickToCallold: "https://my.vocalocity.com/presence/rest/clicktocall/",
        clickToCallMe: "https://my.vocalocity.com/appserver/rest/click2callme/{from}/?phonenumber={to}",
        directory: "https://my.vocalocity.com/presence/rest/directory"
    },
    lastNumbers: [],
    getCookie: function () {
        var me=this;
        storage.get(['username', 'password', 'lastNumbers'], function (loginInfo) {
            console.log(loginInfo, "loginInfo");
            $.ajax({
                url : me.urls.getCookie,
                headers: {
                    login : loginInfo.username,
                    password : loginInfo.password
                },
                success : function (data, status, xhr) {
                    console.log(xhr);
                    console.log(data);
                    console.log(status);
                },
                complete : function (xhr, status) {
                    console.log(xhr);
                    console.log(status);
                    console.log(xhr.getResponseHeader('Set-Cookie'));
                },
                dataType: 'json'
        });
//            var req = new XMLHttpRequest();
//            req.open("GET", me.urls.getCookie, true);
//            req.setRequestHeader("login", loginInfo.username);
//            req.setRequestHeader("password", loginInfo.password);
//            req.send(null);
//            req.onreadystatechange = function () {
//                if (req.readyState == 4) {
//                    switch (req.status) {
//                        case 200 :
//                            console.log(req);
//                            console.log(req.getResponseHeader('Set-Cookie'));
//                            console.log($.cookie());
//                            break;
////                        case 400 :
////                            break;
////                        case 403 :
////                            break;
////                        case 404:
////                            break;
////                        case 500:
////                            break;
//                        default:
//                            console.log("Couldn't get cookie.", "error");
//                    }
//                }
//            }
        });
    },
    placeCall: function (theNumber) {
        var me = this;
        var button = $('#dialbox :submit').hide();
        theNumber = theNumber.replace(/[^0-9]/g, "");
        this.saveNumberDialed(theNumber);
        me.infoMessage("Dialing " + theNumber, "warning");
        storage.get(['username', 'password', 'lastNumbers'], function (loginInfo) {
            console.log(loginInfo, "loginInfo");
            var req = new XMLHttpRequest();
            req.open("GET", me.urls.clickToCall + theNumber, true);
            req.setRequestHeader("login", loginInfo.username);
            req.setRequestHeader("password", loginInfo.password);
            req.send(null);
            req.onreadystatechange = function () {
                if (req.readyState == 4) {
                    switch (req.status) {
                        case 200 :
                            me.infoMessage('Call to ' + theNumber + ' was placed.', "info");
                            break;
                        case 400 :
                            me.infoMessage('Bad phone number', "error");
                            break;
                        case 403 :
                            me.infoMessage('International calls not allowed', "error");
                            break;
                        case 404:
                            me.infoMessage('Your account is inactive', "error");
                            break;
                        case 500:
                            me.infoMessage('A severe system error was detected', "error");
                            break;
                        default:
                            me.infoMessage("The call was NOT placed.", "error");
                    }
                }
                button.show();
            };
        });

    },
    saveLogin: function () {
        var username = $("#username").val();
        var password = $("#password").val();
        storage.set({'username': username, 'password': password});
        this.infoMessage("Username and password saved");
    },
    infoMessage: function (message, msgType) {
        var msg = $('#messageBox');
        console.log(message, msgType);
        msgType = msgType || "info";
        msg.removeAttr('class').addClass(msgType); // @todo had to use removeAttr instead of removeClass() due to bug in jQuery UI
        msg.html(message).stop(true).fadeIn('slow').delay(5000).fadeOut('slow');
    },
    saveNumberDialed: function (number) {
        console.log("Saving " + number);
        console.log(this);

        console.log(this.lastNumbers);

        this.lastNumbers.push(number);
        console.log(this.lastNumbers);

        if (this.lastNumbers.length > 10) {
            this.lastNumbers.shift();
        }
        storage.set({'lastNumbers': this.lastNumbers});
        $("<li />").html($('<a />', {
            href: '#',
            text: this.formatNumber(number)
        })).appendTo($('#recent ul'));


    },
    populateLastDialed: function () {
        var self = this;
        storage.get(['lastNumbers'], function (data) {
            var list = data.lastNumbers || self.lastNumbers;
            console.log(data.lastNumbers);
            console.log(self.lastNumbers);
            console.log(list);
            console.log(data);
            var recent = $('#recent').html('');
            var domList = $('<ul />');
            var link;

            list && $.each(list, function (idx, item) {
                link = $('<a />', {
                    href: "#",
                    text: self.formatNumber(item)
                });
                domList.append(link);
            });
            domList.find('a').wrap("<li />");
            recent.append(domList);
            self.lastNumbers = list;
            console.log(self.lastNumbers);
        });

    },
    loadNumber: function (number) {
        $('#dialer').val(number);
    },
    formatNumber: function (number) {
        if (number.length > 7) {
            number = number.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
        }
        return number;
    },
    init: function () {
        this.populateLastDialed();
        this.getCookie();
    }

};
$(document).ready(function () {
    $('#recent').on('click', 'a', function (e) {
        e.preventDefault();
        vocalocity.loadNumber($(this).text());
        console.log(this);
    });

    $('#dialbox').submit(function (e) {
        var number = document.querySelector('#dialer').value;
        vocalocity.placeCall(number);
        e.preventDefault();
    });

    $('#preferences_form').submit(function (e) {
        e.preventDefault();
        var me = $(this);
        vocalocity.saveLogin();
        $(':input[type!="submit"]', me).each(function () {
            this.value = "";
        });
        $('#result').html("Login information updated").fadeIn('slow').delay(2000).fadeOut('slow');
    });

    vocalocity.init();

});
//document.addEventListener('DOMContentLoaded', function () {
//    document.querySelector('#dialbox').addEventListener('submit', function (e) {
//        var number = document.querySelector('#dialer').value;
//        vocalocity.placeCall(number);
//        e.preventDefault();
//    }, false);
//
//
//});

function init() {
    console.log("Loading Contacts API");
    gapi.client.load('Google.Contacts', '3.0', function () {
        console.log('Contacts API loaded')
    });
}

$("#preferences").accordion({
    collapsible: true,
    //active:false,
    heightStyle: "content"
});

chrome.storage.onChanged.addListener(function (changes, namespace) {
    for (key in changes) {
        var storageChange = changes[key];
        console.log('Storage key "%s" in namespace "%s" changed. ' +
            'Old value was "%s", new value is "%s".',
            key,
            namespace,
            storageChange.oldValue,
            storageChange.newValue);
    }
});