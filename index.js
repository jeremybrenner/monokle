// Set up express with dependencies
var express = require('express'),
    bodyParser = require('body-parser'),
    db = require('./models'),
    session = require('express-session'),
    // morgan = require('morgan'),
    app = express(),
    request = require('request');


var path = require('path'),
    views = path.join(__dirname, 'views');

// Set up middlewear use and serve static assets
app.use(bodyParser.urlencoded({
    extended: true
}));
// app.use(morgan('dev'));
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/bower_components'));
app.use(session({
    secret: 'keyboardcat',
    resave: false,
    saveUninitialized: true
}))

// middlewear for login and sessions
app.use("/", function(req, res, next) {
    req.login = function(user) {
        req.session.userId = user._id;
        req.user = user;
        return user;
    };

    req.logout = function() {
        req.session.userId = null;
        req.user = null;
    };

    req.currentUser = function(cb) {
        var userId = req.session.userId;
        db.User.
        findOne({
            _id: userId
        }, cb);
    };
    next();
});


// GET on the root route
app.get("/", function(req, res) {
    res.sendFile(path.join(views, "home.html"));
});

app.get("/signup", function(req, res) {
    var signupPath = path.join(views, "home.html");
    res.sendFile(signupPath);
});

app.get("/login", function(req, res) {
    var loginPath = path.join(views, "home.html");
    res.sendFile(loginPath);
});

// get on the user route, redirects to login or
// goes to main app
app.get("/user", function(req, res) {
    req.currentUser(function(err, user) {
        if (user) {
            res.sendFile(path.join(views, "monokle.html"));
        } else {
            res.redirect("/");
        }
    })
});

/////////// internal api ///////////
app.get("/api/current", function(req, res) {
    req.currentUser(function(err, user) {
        res.send(user._id)
    })
})

// route which fetches and checks data from external API
app.get("/api/articles", function(req, res) {
    db.ApiData.fetchData(function(err, data) {
        res.send(data);
    })
});
// finds email of current user
app.get("/api/username", function(req, res) {
    var current = req.session.userId
    db.User.findById(current, function(err, user) {
        res.send(user)
    })
});

// retrieves all the favorites stored in a user
app.get("/user/favorites", function(req, res) {
    req.currentUser(function(err, user) {
        res.send(user)
    })
});

/////////// GET routes //////////
// sends user to a page of their favorites
app.get("/user/favorites/list", function(req, res) {
    var favList = path.join(views, "favorites.html");
    res.sendFile(favList);
})

app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
});

// route which recieves the post from the signup form
app.post("/signup", function(req, res) {
    var newUser = req.body.user;
    db.User.
    createUser(newUser, function(err, user) {
        if (user) {
            req.login(user);
            res.redirect("/user");
        } else {
            res.redirect("/");
        }
    });
});

// route which recieves the post from the login form
app.post("/login", function(req, res) {
    var user = req.body.user;

    db.User.
    authenticate(user,
        function(err, user) {
            if (!err) {
                req.login(user);
                res.redirect("/user");
            } else {
                res.redirect("/");
            }
        })
});

app.post("/user/favorites", function(req, res) {
    var favObj = req.body
    console.log(favObj)
    var current = req.session.userId
    db.User.findById(current, function(err, user) {
        user.favorites.push(favObj)
        user.save()
    })

})

//delete favorite article from database
app.delete("/user/favorites/:_id", function (req, res) {
    var current = req.session.userId
    var favArt = req.params._id
    db.User.findById(current, function(err, user) {
        user.favorites.pull(favArt)
        user.save()
        console.log("deleted")
        res.send(user)
     })   
});




// Server
app.listen(process.env.PORT || 3000, function() {
    console.log("THE MAGIC IS HAPPENING");
})