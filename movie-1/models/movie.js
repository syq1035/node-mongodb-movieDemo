var mongoose = require('mongoose');
var MovieScheme = require('../schemas/movie');
var Movie = mongoose.model('Movie',MovieScheme);

module.exports = Movie;