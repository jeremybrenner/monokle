$(document).ready(function() {

    // render articles on page load
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

    $.get("/user/favorites").
    done(function(data) {
        data = JSON.parse(data)
        console.log(data)
    });

    // for grabbing user name and rendering it to front
    // $.get("/api/userfetch").
    // done(function(data){
    // })
});

function makeFav(fav) {
    var link = $(fav).data().link
    var title = $(fav).data().title
    var obj = {
        title: title,
        link: link
    }
    $.post("/user/favorites", obj).
    done(function(link) {
        console.log(link)
    })

    //  $.post("/user/favorites", link, user)
    // done function -> template
    //render the favorites to the favorite list
}