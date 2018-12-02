var mongoose = require('mongoose');
var CommentScheme = require('../schemas/comment');
var Comment = mongoose.model('Comment',CommentScheme);

module.exports = Comment;