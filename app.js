var express = require('express')
    , routes = require('./routes')
    , user = require('./routes/user')
    , http = require('http')
    , path = require('path')
    , jade = require('jade');
var TaskList = require('./routes/tasklist');
var taskList = new TaskList(process.env.CUSTOMCONNSTR_MONGOLAB_URI);


var app = express();


app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.engine('jade', function(path, options, fn){
    options.pretty = typeof options.pretty == 'undefined' ? true : options.pretty;
    return jade.__express(path, options, fn)
  });
  app.set('view engine', 'jade');
  app.set('view cache', false);
  app.set('view options', { pretty: true });
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


app.get('/', taskList.showTasks.bind(taskList));
app.post('/addtask', taskList.addTask.bind(taskList));
app.post('/completetask', taskList.completeTask.bind(taskList));


http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});