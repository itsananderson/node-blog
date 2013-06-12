var express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	emitter = require('events').EventEmitter,
	events = new emitter(),
	route = require('./route'),
	configure = require('./configure'),
	socket = require('./socket'),
	io = require('socket.io').listen(server);

configure(app, io, events);
route(app, io, events);
socket(app, io, events);

server.listen(app.get('port'), function(){
	console.log("Node blog started on port " + app.get('port'));
});
