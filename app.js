var express = require('express'),
	app = express(),
	http = require('http'),
	emitter = require('events').EventEmitter,
	events = new emitter(),
	route = require('./route'),
	configure = require('./configure');

var connectionString = process.env.CUSTOMCONNSTR_MONGOLAB_URI || 'mongodb://localhost:27017';
require('mongoose').connect(connectionString);

configure(app);
route(app);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});