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

    // grabs and renders favorites stored to a user
    $.get("/user/favorites").
    done(function(data) {
        var $favCon = $('#favCon')
        var favTemp = _.template($('#favTemp').html())
        console.log(data.favorites)
        $(data.favorites).each(function(test, data) {
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

});

    // takes favorited article and embeds it in user
    function makeFav(fav) {
        console.log($(fav).data())
        var link = $(fav).data().link
        var title = $(fav).data().title
        var obj = {
            title: title,
            link: link,
        }

        $.post("/user/favorites", obj).
        done(function() {
            console.log(link)
        });
    }


    function deleteFav(fav) {
        console.log($(fav).data().id)
        var _id = $(fav).data().id;
        var $favorite = $(fav).closest(".favCon");
        console.log($favorite)
        $.ajax({
            url: "/user/favorites/" + _id,
            type: "DELETE"
        }).done(function(){
            console.log("were back!")
            $favorite.remove();
            console.log("removed!")
        });
    }