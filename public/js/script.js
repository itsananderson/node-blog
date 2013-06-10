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
			getContent: function(id) {
				return $http.get('/api/post/' + id);
			},
			subscribeToChange: function (id) {
				return $http.get('/api/posts/' + id + '/subscribe');
			},
			savePost: function(slug, post){
				return $http.post('/api/posts/' + slug, {post:post});
			},
			createPost: function(post) {
				return $http.post('/api/posts', {post:post});
			}
		}
	})

	.controller('PostCtrl', function($scope, PostFactory){
		$scope.post = Post;

		var getUpdate = function(cb) {
			PostFactory.subscribeToChange(Post._id).success(function(res) {
				if ( res.post ) {
					$scope.post = res.post;
				}
				cb.apply(arguments);
			}).error(function(){
				setTimeout(cb.bind(undefined, arguments), 1000);
			});
		};

		var updateLoop = function updateLoop() {
			getUpdate(updateLoop);
		};

		updateLoop();
	})

	.controller('PostEditCtrl', function($scope, PostFactory){
		var slug = Post.postSlug;
		$scope.post = Post;

		$scope.postDirty = false;
		$scope.draftSaving = false;

		var queueSave = function(newVal, oldVal) {
			if ( newVal !== oldVal ) {
				$scope.postDirty = true;
			}
		};

		$scope.$watch('post.postName', queueSave);
		$scope.$watch('post.postDraft', queueSave);

		setInterval(function(){
			if ( $scope.postDirty && !$scope.draftSaving ) {
				$scope.draftSaving = true;
				PostFactory.savePost(slug, $scope.post).success(function() {
					$scope.draftSaving = false;
				});
				$scope.postDirty = false;
			}
		}, 100);
	})

	.controller('PostNewCtrl', function($scope, PostFactory) {
		$scope.post = {postName:'', postSlug: ''};

		var slugFilter = function(val) {
			var filterFunc = function(slug) {
				return slug.replace(/[^a-zA-Z0-9\-]+/, '-')
					.replace('--', '-')
					.replace(/-+$/, '');
			};

			var oldSlug = val;
			var newSlug = filterFunc(val);
			while( oldSlug != newSlug) {
				oldSlug = newSlug;
				newSlug = filterFunc(newSlug);
			}
			return newSlug.toLowerCase();
		};

		$scope.$watch('post.postName', function(newVal, oldVal){
			var newSlug = slugFilter(newVal);
			var oldSlug = slugFilter(oldVal);
			if ($scope.post.postSlug == oldSlug || $scope.post.postSlug == '') {
				console.log('same');
				$scope.post.postSlug = newSlug;
			} else {
				console.log('diff');
			}
		});

		$scope.changeSlug = function() {
			console.log('here');
			if ( $scope.post.postSlug == '' ) {
				$scope.post.postSlug = slugFilter($scope.post.postName);
			}
		};

		$scope.createPost = function() {
			PostFactory.createPost($scope.post).success(function(){
				window.location = '/posts/' + $scope.post.postSlug + '/edit';
			});
		}
	});