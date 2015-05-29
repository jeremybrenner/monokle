var mongoose = require("mongoose");
var request = require("request");

var apiDataSchema = new mongoose.Schema({
    title: String,
    result: mongoose.Schema.Types.Mixed,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

var usaUrl = "http://api.usatoday.com/open/articles?tag=news&count=25&encoding=json&api_key=65rzxcjftufucbju8jmsyr9h";

apiDataSchema.statics.usaUrl = usaUrl;

apiDataSchema.statics.fetchData = function(cb) {
    var api = this;
    var currTime = Date.now();
    api.findOne({}, {}, {
            sort: {
                'created_at': -1
            }
        },
        function(err, apiData) {
            // if api data is greater than four hours old
            if (!apiData || currTime - apiData.createdAt > 1000 * 100 * 100) {
                console.log("OLD DATA -- fetching new data")
                if (apiData) {
                    apiData.remove();
                }
                request(api.usaUrl, function(err, response, bdy) {
                    api.create({
                        title: "USA Today data",
                        result: bdy
                    }, function(err, data) {
                        cb(err, data.result)
                    })
                });

            } else {
                console.log("USING OLD DATA -- still fresh")
                cb(err, apiData.result);
            }
        });

}

module.exports = mongoose.model("ApiData", apiDataSchema);