var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/monokletest')

module.exports.User = require('./user')
module.exports.ApiData = require('./api_data.js')
