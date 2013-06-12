var MarkdownTest = require('./controllers/markdownTest'),
	PostList = require('./controllers/post');

module.exports = function(app, io, events) {
	var markdownTest = new MarkdownTest(app, io, events),
		postList = new PostList(app, io, events);

	app.get('/', markdownTest.markdown.bind(markdownTest));
	app.get('/markdown', markdownTest.markdown.bind(markdownTest));
	app.get('/posts', postList.showPosts.bind(postList));
	app.get('/posts/new', postList.newPost.bind(postList));
	app.get('/posts/:slug', postList.viewPost.bind(postList));
	app.get('/posts/:slug/edit', postList.editPost.bind(postList));

	app.post('/api/posts', postList.addPost.bind(postList));
	app.post('/api/posts/:slug', postList.savePost.bind(postList));
};