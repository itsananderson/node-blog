var app = angular.module('app', [])
    
	.config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/agencies', { templateUrl: 'partials/agencies.html', controller: 'AgencyCtrl' });
        $routeProvider.when('/advertisers', { templateUrl: 'partials/advertisers.html', controller: 'AdvertiserCtrl' });
        $routeProvider.when('/engagements', { templateUrl: 'partials/engagements.html', controller: 'EngagementCtrl' });
        $routeProvider.otherwise({ redirectTo: '/agencies' });
    }])
	
	.controller('MdCtrl', function ($scope) {
		
	})
	
	.filter('markdown', function() {
		return function(text) {
			if (typeof text == "undefined") {
				return "";
			}
			return markdown.toHTML(String(text));
		}
	});