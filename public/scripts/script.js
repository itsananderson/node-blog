var app = angular.module('app', [])
	
	.filter('markdown', function() {
		return function(text) {
			if (typeof text == "undefined") {
				return "";
			}
			return markdown.toHTML(String(text));
		}
	});