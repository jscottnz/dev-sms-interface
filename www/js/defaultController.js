angular.module('sms').controller('defaultController', [
	'$scope',
	'smsService',
	'httpSmsServer', // change this to send sms to different servers
	'$ionicScrollDelegate',
	'$interval',

	function($scope, smsService, smsServer, $ionicScrollDelegate, $interval) {
		
		$scope.smsTo = ""
		$scope.smsFrom = ""
		$scope.smsText = ""
		$scope.smsList = []

		sendSms = function(phonenumber, text) {
			var sms = {
				to : $scope.smsTo,
				sender : $scope.smsFrom,
				text : text
			}

			smsService.sendSms(smsServer, $scope.smsList, sms, function() {
				$ionicScrollDelegate.scrollBottom(true)
			})
			$scope.smsText = ""	
		}

		fetchSms = function() {
			smsService.fetchSms($scope.smsFrom, smsServer, $scope.smsList, function() {
				$ionicScrollDelegate.scrollBottom(true)
			})	
		}
		$interval(fetchSms, 2000)

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
	  	var queue = []
	    return {
			sendSms : function(sms, responseCB) {
				queue.push({
			  		sender : "Service",
			  		text : "This is a reply from the mock server",
			  		datetime : new Date().getTime()
				})
			},

			fetchSms : function(id, responseCB) {
				if(queue.length > 0) {
					responseCB(queue.shift())
				}
			}
	    }
  	}
])

.factory('httpSmsServer', ['$http', 

	function($http){
		return {
			sendSms : function(sms, responseCB) {
		      	$http.post('http://localhost:5000/' + sms.to, sms)
		      	.error(function(data, status, headers, config) {
				    console.log(data)
				});
		    },

		    fetchSms : function(id, responseCB) {
		      	$http.get('http://localhost:5000/' + id)
		      	.success(function(data) {
		      		if(data) {
		      			responseCB(data)
		      		}
		      	})
		    }
	    }
	}
])