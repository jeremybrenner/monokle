$(document).ready(function() {

    // render articles on page load from db or api call
    $.get("/api/articles").
    done(function(data) {
        var $artCon = $('#artCon')
        var artTemp = _.template($('#articleTemp').html())
        data = JSON.parse(data)
        console.log(data)
        $(data.stories).each(function(test, data) {
            var $data = $(artTemp(data));
            // console.log($data)
            $artCon.append($data)
        });
    });

    // grabs and renders favorites stored to a user,
    // now starting with most recent picks
    $.get("/user/favorites").
    done(function(data) {
        var $favCon = $('#favCon')
        var favTemp = _.template($('#favTemp').html())
        console.log(data.favorites)
            //reverses the saved favorites so most recent are first
        $($(data.favorites).get().reverse()).each(function(test, data) {
            var $data = $(favTemp(data));
            // console.log($data)
            $favCon.append($data)
        })
    });

    // grabbing user name and rendering it to front
    $.get("/api/username").
    done(function(data) {
        console.log("email is " + data.email)
        var $nameCon = $('.dropdown')
        var nameTemp = _.template($('#nameTemp').html())
        var $data = $(nameTemp(data));
        $nameCon.append($data)
    })

    $('body').on("click", "#favorite", function(event) {
        makeFav(event.target)
    });

    $('body').on("click", "#delete", function(event) {
        deleteFav(event.target)
    })

});


// takes favorited article and embeds it in user
function makeFav(fav) {
    var link = $(fav).data().link
    var title = $(fav).data().title
    var obj = {
        title: title,
        link: link,
    }

    $.post("/user/favorites", obj).
    done(function() {
        console.log("This link was added to the user: " + link)
    });
}

// deletes favorited article and removes from list
// and updates DOM
function deleteFav(fav) {
    var _id = $(fav).data().id;
    var $favorite = $(fav).closest(".favCon");
    $.ajax({
        url: "/user/favorites/" + _id,
        type: "DELETE"
    }).done(function() {
        $favorite.remove();
        console.log("Deleted");
    });
}