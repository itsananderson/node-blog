var app = angular.module('app', [])
	
	.filter('markdown', function() {
		return function(text) {
			if (typeof text == "undefined") {
				return "";
			}
			return markdown.toHTML(String(text));
		}
	})

	.factory('PostFactory', function($http) {
		return {
			getPostContent: function (slug) {
				return $http.get('/post-content/' + slug);
			},
			savePost: function(slug, post){
				return $http.post('/post-save/' + slug, {post:post});
			},
			createPost: function(post) {
				return $http.post('/post-create', {post:post});
			}
		}
	})

	.controller('PostCtrl', function($scope, PostFactory){
		$scope.post = Post;

		setInterval(function() {
			PostFactory.getPostContent(Post.postSlug).success(function(post) {
				$scope.post = post;
			})
		}, 1000)
	})

	.controller('PostEditCtrl', function($scope, PostFactory){
		var slug = Post.postSlug;
		$scope.post = Post;

		setInterval(function(){
			PostFactory.savePost(slug, $scope.post).success(function() {
			});
		}, 1000);
	})

	.controller('PostNewCtrl', function($scope, PostFactory) {
		$scope.post = {postTitle:''};

		$scope.$watch('post.postTitle', function(newVal){
			var filter = function(val) {
				return val.replace(' ', '-').replace('--', '-');
			};
			var oldSlug = newVal;
			var newSlug = filter(newVal);
			while( oldSlug != newSlug) {
				oldSlug = newSlug;
				newSlug = filter(newSlug);
			}
			$scope.post.postSlug = newSlug.toLowerCase();

			$scope.createPost = function() {
				PostFactory.createPost($scope.post).success(function(){
					window.location = '/post-edit/' + $scope.post.postSlug;
				});
			}
		});
	});