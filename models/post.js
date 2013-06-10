var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

 var PostSchema = new Schema({
	postName: String,
	postSlug: String,
	postDate: {type: Date, default: Date.now},
	postUpdated: {type: Date, default: Date.now},
	postCategory: String,
	postDraft: String
 });

 module.exports = mongoose.model('PostModel', PostSchema);