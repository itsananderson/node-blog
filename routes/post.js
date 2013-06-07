var post = require('../models/post.js');

module.exports = PostList;

function PostList() {}

PostList.prototype.showPosts = function(req, res) {
	post.find({}, function foundPosts(err, items) {
		res.render('post-list',{title: 'My Blog', posts: items})
	});
};

PostList.prototype.viewPost = function(req, res) {
	post.find({postSlug: req.params.slug}, function(err, posts){
		if ( posts.length ) {
			console.log(posts[0]);
			res.render('post', {title: 'My Blog', post: posts[0]});
		} else {
			console.log('not found');
			res.send('not found');
		}
	});
};

PostList.prototype.getPostContent = function(req, res) {
	var slug = req.params.slug;
	post.findOne({postSlug: slug}, function(err, post){
		res.json(post);
	});
};

PostList.prototype.newPost = function(req, res) {
	console.log('here i am');
	res.render('post-new', {title: 'My Blog'});
};

PostList.prototype.addPost = function(req,res) {
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
		res.render('post-edit', {title: 'My Blog', post: post});
	});
};

PostList.prototype.savePost = function(req, res) {
	var slug = req.params.slug;
	var updatedPost = req.body.post;
	delete updatedPost._id;

	console.log(slug)
	post.update({postSlug: slug}, {$set: updatedPost}, function(err){
		console.log(err);
	});
	res.end();
};
