var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var UserSchema = new Schema({
	name: String,
	username: String,
	password: String,
	email: String,
	created: {type: Date, default: Date.now},
	level: Number,
	permissions: Array
});

module.exports = mongoose.model('UserModel', UserSchema);
