var postModel = require('./models/post.js');

module.exports = function(app, io, events) {
	io.sockets.on('connection', function (socket) {
		// Set up event listeners on this socket
		socket.once('post:subscribeToPreviews', function(postId) {
			var postDraftUpdated = function(post) {
				socket.emit('post:previewUpdated:' + postId, post);
			};
			events.on('post:previewUpdated:' + postId, postDraftUpdated);
			socket.on('disconnect', function() {
				events.removeListener('post:previewUpdated:' + postId, postDraftUpdated);
			});
		});

		socket.on('post:savePreview', function(post) {
			console.log(post);
			console.log('post:previewUpdated:' + post._id);
			socket.emit('post:previewUpdated:' + post._id);
			events.emit('post:previewUpdated:' + post._id, post);
		});

		socket.on('post:saveDraft', function(post) {
			var slug = post.postSlug;
			var postId = post._id;
			delete post._id;
			post.postUpdated = new Date();
			postModel.update({postSlug: slug}, {$set: post}, function(err){
				if (null !== err) {
					console.log('error', err);
				} else {
					console.log('test');
				}
			});
			socket.emit('post:draftUpdated:' + postId);
			events.emit( 'post:draftUpdated:' + postId, post);
		});

		socket.on('post:saveDraft', function(post) {
			var slug = post.postSlug;
			var postId = post._id;
			delete post._id;
			post.postUpdated = new Date();
			post.postContent = post.postDraft;
			postModel.update({postSlug: slug}, {$set: post}, function(err){
				if (null !== err) {
					console.log('error', err);
				}
			});
			socket.emit('post:updated:' + postId);
			events.emit( 'post:updated:' + postId, post);
		});
	});
};