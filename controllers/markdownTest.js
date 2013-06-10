module.exports = MarkdownTest;

function MarkdownTest() {}

MarkdownTest.prototype.markdown = function(req,res) {
	res.render('markdown', {title: 'Markdown Angular Test'});
};

