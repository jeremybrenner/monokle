var mongoose = require("mongoose");
var favSchema = new mongoose.Schema({

	article: {
		url: String
	}
})

var Favorite = mongoose.model("Favorite", favSchema);
module.exports = Favorite