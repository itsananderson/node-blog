var express = require('express')
    , routes = require('./routes')
    , user = require('./routes/user')
    , http = require('http')
    , path = require('path')
    , mongoose = require('mongoose')
    , jade = require('jade');
var TaskList = require('./routes/tasklist');
var PostList = require('./routes/post');

var connectionString = process.env.CUSTOMCONNSTR_MONGOLAB_URI || 'mongodb://localhost:27017';
mongoose.connect(connectionString);

var taskList = new TaskList();
var postList = new PostList(process.env.CUSTOMCONNSTR_MONGOLAB_URI || 'mongodb://localhost:27017');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.engine('jade', function(path, options, fn){
    options.pretty = typeof options.pretty == 'undefined' ? true : options.pretty;
    options.styles = [
		{href:'/stylesheets/bootstrap.css'},
		{href:'/stylesheets/bootstrap-responsive.css'},
		{href:'/stylesheets/style.css'}
	];
    options.scripts = [
		{src: '/scripts/angular.min.js'},
		{src: '/scripts/jquery.min.js'},
		{src: '/scripts/bootstrap.min.js'},
		{src: '/scripts/markdown.js'},
		{src: '/scripts/script.js'}
	];
    return jade.__express(path, options, fn)
  });
  app.set('view engine', 'jade');
  app.set('view cache', false);
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});


app.configure('development', function(){
  app.use(express.errorHandler());
});


//app.get('/', taskList.showTasks.bind(taskList));
app.get('/', taskList.markdown.bind(taskList));
app.get('/markdown', taskList.markdown.bind(taskList));
app.post('/addtask', taskList.addTask.bind(taskList));
app.post('/completetask', taskList.completeTask.bind(taskList));
app.get('/posts', postList.showPosts.bind(postList));
app.get('/post-new', postList.newPost.bind(postList));
app.post('/post-create', postList.addPost.bind(postList));
app.get('/post-content/:slug', postList.getPostContent.bind(postList));
app.get('/post-edit/:slug', postList.editPost.bind(postList));
app.post('/post-save/:slug', postList.savePost.bind(postList));

app.get('/:slug', postList.viewPost.bind(postList));


http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});