var mongoose = require('mongoose');
mongoose.connect(process.env.MONGOLAB_URI ||
    process.env.MONGOHQ_URL ||
    "mongodb://localhost/monokle")

module.exports.User = require('./user')
module.exports.ApiData = require('./api_data.js')