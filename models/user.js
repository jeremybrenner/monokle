var mongoose = require("mongoose");
var favSchema = new mongoose.Schema({
    title: String,
    link: String
});

var Favorite = mongoose.model("Favorite", favSchema);

var userSchema = new mongoose.Schema({

    email: {
        type: String,
        lowercase: true,
        required: true,
        index: {
            unique: true
        }
    },

    passwordDigest: {
        type: String,
        required: true
    },

    favorites: [favSchema]
});

var bcrypt = require("bcrypt");

var confirm = function(pswrd, pswrdCon) {
    return pswrd === pswrdCon;
};

userSchema.statics.createUser = function(params, cb) {
    var doesMatch;

    doesMatch = confirm(params.password, params.password_confirmation);

    if (!doesMatch) {
        return cb("Do not match", null);
    }

    var that = this;

    bcrypt.hash(params.password, 12, function(err, hash) {
        params.passwordDigest = hash;
        that.create(params, cb);
    });

};

userSchema.statics.authenticate = function(params, cb) {
    this.findOne({
            email: params.email
        },
        function(err, user) {
            if (user) {
                user.passCheck(params.password, cb);
            } else {
                return err;
            }
        });
};

userSchema.methods.passCheck = function(password, cb) {
    var user = this;
    bcrypt.compare(password,
        this.passwordDigest,
        function(err, isMatch) {
            if (isMatch) {
                cb(null, user);
            } else {
                cb("no", null);
            }
        });
};

var User = mongoose.model("User", userSchema);

module.exports = User;