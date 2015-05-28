$(document).ready(function() {


    //  // grabs data object from api
    // var $pulledData = $.get("/api/articles", render)
    //  // renders to the client
    //  function render(data) {
    //   data = JSON.parse(data)
    //          $.each(data.stories, function(){
    //            console.log(this.link)
    //            console.log(this.title)
    //              $('body').append("<div><a href="+JSON.stringify(this.link)+">"+this.title+"</a></div>");
    //          })

    //      }

    //templates
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

    // for grabbing user name and rendering it to front
    // $.get("/api/userfetch").
    // done(function(data){
    // })


});





 