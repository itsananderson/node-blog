var app = angular.module('app', [])

	.filter('markdown', function() {
		return function(text) {
			if (typeof text == "undefined") {
				return "";
			}
			return markdown.toHTML(String(text));
		}
	})

	.factory('io', function() {
		return window.io.connect();
	})

	.factory('PostFactory', function($http, io) {
		return {
			getContent: function(id) {
				return $http.get('/api/post/' + id);
			},
			subscribeToPreviews: function (id, cb) {
				io.emit('post:subscribeToPreviews', id);
				io.on('post:previewUpdated:' + id, cb);
			},
			savePreview: function(slug, post, cb) {
				io.emit('post:savePreview', post);
				io.on('post:previewUpdated:' + post._id, cb);
			},
			saveDraft: function(slug, post, cb) {
				io.emit('post:saveDraft', post);
				io.on('post:draftUpdated:' + post._id, cb);
			},
			savePost: function(slug, post, cb){
				io.emit('post:savePost', post);
				io.on('post:updated:' + post._id, cb);
			},
			createPost: function(post) {
				return $http.post('/api/posts', {post:post});
			}
		}
	})

	.controller('PostCtrl', function($scope, PostFactory){
		$scope.post = Post;

		PostFactory.subscribeToPreviews(Post._id, function(post){
			$scope.$apply(function(){
				$scope.post = post;
			});
		});
	})

	.controller('PostEditCtrl', function($scope, PostFactory){
		var slug = Post.postSlug;
		if ( !Post.postPreview ) {
			Post.postPreview = Post.postDraft;
		}
		$scope.post = Post;

		$scope.postDirty = false;
		$scope.draftSaving = false;

		var queueSave = function(newVal, oldVal) {
			if ( newVal !== oldVal ) {
				$scope.previewDirty = true;
				$scope.draftDirty = true;
			}
		};

		$scope.$watch('post.postName', queueSave);
		$scope.$watch('post.postPreview', queueSave);

		setInterval(function(){
			if ( $scope.previewDirty && !$scope.previewSaving ) {
				console.log('previewing');
				$scope.previewSaving = true;
				PostFactory.savePreview(slug, $scope.post, function() {
					$scope.$apply(function() {
						$scope.previewSaving = false;
					});
				});
				$scope.$apply(function() {
					$scope.previewDirty = false;
				});
			}
		}, 100);

		setInterval(function(){
			if ( $scope.draftDirty && !$scope.draftSaving ) {
				console.log('drafting');
				$scope.draftSaving = true;
				$scope.post.postDraft = $scope.post.postPreview;
				PostFactory.saveDraft(slug, $scope.post, function() {
					$scope.$apply(function() {
						$scope.draftSaving = false;
					});
				});
				$scope.$apply(function() {
					$scope.draftDirty = false;
				});
			}
		}, 1000);
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
				$scope.post.postSlug = newSlug;
			}
		});

		$scope.changeSlug = function() {
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