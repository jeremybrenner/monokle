var mongoose = require('mongoose');
mongoose.connect(process.env.MONGOLAB_URI ||
    process.env.MONGOHQ_URL ||
    "mongodb://localhost/monokletest")

module.exports.User = require('./user')
module.exports.ApiData = require('./api_data.js')