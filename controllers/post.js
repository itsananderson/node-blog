var post = require('../models/post.js');

module.exports = PostList;

function PostList(app, io, events) {
	this.app = app;
	this.io = io;
	this.events = events;
}

PostList.prototype.showPosts = function(req, res) {
	post.find({}).sort('postDate').exec(function foundPosts(err, items) {
		res.render('post/index',{title: 'My Blog', posts: items})
	});
};

PostList.prototype.viewPost = function(req, res) {
	post.find({postSlug: req.params.slug}, function(err, posts){
		if ( posts.length ) {
			res.render('post/single', {title: 'My Blog', post: posts[0]});
		} else {
			res.status(404).header('Content-Type', 'text/plain').send('Cannot GET ' + req.url);
		}
	});
};

/*
PostList.prototype.subscribeToChange = function subscribeToChange(req, res) {
	var id = req.params.id,
		sent = false;

	var updateHandler = function(post){
		sent = true;
		res.header('Expires', '-1');
		res.json({post:post});
	};

	events.once('updated-post-' + id, updateHandler);

	setTimeout( function() {
		if ( !sent ) {
			events.removeListener( 'updated-post-' + id, updateHandler );
			res.header('Expires', '-1');
			res.json({timeout: 'Timed out without an update'});
		}
	}, 25000);
};
*/

PostList.prototype.newPost = function(req, res) {
	res.render('post/new', {title: 'My Blog'});
};

PostList.prototype.addPost = function addPost(req,res) {
	var item = req.body.post;
	delete item._id;
	new post(item).save(function savedPost(err){
		if(err) {
			throw err;
		}
	});
	res.end();
};

PostList.prototype.editPost = function(req,res) {
	post.findOne({postSlug: req.params.slug}, function(err, post){
		res.render('post/edit', {title: 'My Blog', post: post});
	});
};

PostList.prototype.savePost = function savePost(req, res) {
};
