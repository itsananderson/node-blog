var mongoose = require('mongoose'),
    task = require('../models/task.js');

module.exports = TaskList;

function TaskList(connection) {
	if (typeof connection != 'undefined') {
		mongoose.connect(connection);
	}
}


TaskList.prototype.showTasks = function(req, res) {
  task.find({itemCompleted: false}, function foundTasks(err, items) {
    res.render('index',{title: 'My ToDo List ', tasks: items})
  });
};


TaskList.prototype.addTask = function(req,res) {
  var item = req.body.item;
  newTask = new task();
  newTask.itemName = item.name;
  newTask.itemCategory = item.category;
  newTask.save(function savedTask(err){
    if(err) {
      throw err;
    }
  });
  res.redirect('/');
};

TaskList.prototype.completeTask = function(req,res) {
  var completedTasks = req.body;
  for(taskId in completedTasks) {
    if(completedTasks[taskId]=='true') {
      var conditions = { _id: taskId };
      var updates = { itemCompleted: completedTasks[taskId] };
      task.update(conditions, updates, function updatedTask(err) {
        if(err) {
          throw err;
        }
      });
    }
  }
  res.redirect('/');
};

TaskList.prototype.markdown = function(req,res) {
	res.render('markdown', {title: 'Markdown Angular Test'});
};