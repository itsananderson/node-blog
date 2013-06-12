module.exports = function(app, io, events) {

	var connectionString = process.env.CUSTOMCONNSTR_MONGOLAB_URI || 'mongodb://localhost:27017';
	require('mongoose').connect(connectionString, {server: {socketOptions: { keepAlive: 1 } } });

	var express = require('express'),
		path = require('path'),
		jade = require('jade');

	app.configure(function(){
		app.set('port', process.env.PORT || 3000);
		app.set('views', __dirname + '/views');
		app.engine('jade', function(path, options, fn){
			options.pretty = typeof options.pretty == 'undefined' ? true : options.pretty;
			options.styles = [
				{href:'/lib/css/bootstrap.css'},
				{href:'/lib/css/bootstrap-responsive.css'},
				{href:'/css/style.css'}
			];
			options.scripts = [
				{src: '/socket.io/socket.io.js'},
				{src: '/lib/js/angular.min.js'},
				{src: '/lib/js/jquery.min.js'},
				{src: '/lib/js/bootstrap.min.js'},
				{src: '/lib/js/markdown.js'},
				{src: '/js/script.js'}
			];

			options.footerScripts = [];

			options.loggedIn = true;
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
};