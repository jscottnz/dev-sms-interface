
angular.module('sms', ['ionic'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });


})

.factory('smsService', [
  function() {
    return {
      sendSms : function(smsServer, smsList, sms, notifyUpdateCB) {
        sms.datetime = new Date().getTime()
        smsList.push(sms)
        notifyUpdateCB()
        smsServer.sendSms(sms)
      },

      fetchSms : function(id, smsServer, smsList, notifyUpdateCB) {
        smsServer.fetchSms(id, function(response) {
          smsList.push(response)
          notifyUpdateCB()
        })
      }
    }
  }
])

