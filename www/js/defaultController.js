angular.module('sms').controller('defaultController', [
	'$scope',
	'smsService',
	'mockSmsServer', // change this to send sms to different servers
	'$ionicScrollDelegate',

	function($scope, smsService, smsServer, $ionicScrollDelegate) {
		$scope.setup = {
			appTitle : "Default Test App",
			serviceDescriptionTitle : "How to use service",
			serviceDescriptionBody : "Send an SMS and we'll send a reply",

			user : {
				phoneNumber : "+15555555555"
			}		
		}

		$scope.smsText = ""
		$scope.smsList = []

		sendSms = function(phonenumber, text) {
			var sms = {
				sender : phonenumber,
				text : text
			}

			smsService.sendSms(smsServer, $scope.smsList, sms, function() {
				$ionicScrollDelegate.scrollBottom(true)
			})
			$scope.smsText = ""	
		}

		$scope.sendSms = sendSms
	}

])

/*
 * A mock server that simulates a response
 * This is only used as a proof of concept
 * Implement your own to communicate with a real server
 * 
 */
.factory('mockSmsServer', [ '$timeout',

  function($timeout) {
    return {
      sendSms : function(sms, responseCB) {

        var response = {
          sender : "Service",
          text : "This is a reply from the mock server",
          datetime : new Date().getTime()
        }

        $timeout(function() {
          responseCB(response)
        }, Math.floor(Math.random() * 4000) + 500)
      }
    }
  }
])

.factory('exampleHttpServer', ['$http', 

	function($http){
		return {
			sendSms : function(sms, responseCB) {

		      	$http.get('/someUrl').success(function(data, status, headers, config) {
					responseCB(data)
				})
		    }
	    }
	}
])