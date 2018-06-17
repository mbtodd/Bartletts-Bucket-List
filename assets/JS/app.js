
$(document).ready(() => {
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyAWRVHG2OAqTmPVRW1n1bOKYhkvPzDkXEg",
        authDomain: "bartlet-s-bucket-list.firebaseapp.com",
        databaseURL: "https://bartlet-s-bucket-list.firebaseio.com",
        projectId: "bartlet-s-bucket-list",
        storageBucket: "bartlet-s-bucket-list.appspot.com",
        messagingSenderId: "129357236055"
    };

    firebase.initializeApp(config);

    var database = firebase.database();
    var userID = "";

    // Sign-in event
    $('body').on('click', '#sign-in' ,  event => {
        event.preventDefault();
        var email = $('#email').val();
        var password = $('#password').val().trim();
        var auth = firebase.auth();
        // console.log('uadhgfkuhsdaku')
        var promise = auth.signInWithEmailAndPassword(email, password).then((user) => {

        });
        promise.catch(event => {

            console.log(event.message)
        });
    })

    states = ["","AK", "AL", "AR", "AS", "AZ", "CA", "CO", "CT", "DC", "DE", "FL",
        "GA", "HI", "IA", "ID", "IL", "IN", "KS", "KY", "LA", "MA", "MD", "ME", "MI",
        "MN", "MO", "MS", "MT", "NC", "ND", "NE", "NH", "NJ", "NM", "NV", "NY", "OH",
        "OK", "OR", "PA", "PR", "RI", "SC", "SD", "TN", "TX", "UT", "VA", "VI", "VT",
        "WA", "WI", "WV", "WY"]
    for (var i = 0; i < states.length; i++) {
        var statebutton = $("<option>");
        statebutton.attr("value", states[i]);
        statebutton.text(states[i]);
        $("#statelist").append(statebutton)
    };

    // Sign-up event
    $('#sign-up').on('click', event => {
        event.preventDefault();
        var email = $('#email').val();
        var password = $('#password').val();
        var auth = firebase.auth();
        auth.createUserWithEmailAndPassword(email, password).then((user) => {
            console.log(user)

        }).catch(event => console.log(event.message));
    })

    // Realtime auth listener
    firebase.auth().onAuthStateChanged(firebaseUser => {
        $('#sign-out').removeClass('hide');
        if (firebaseUser) {
            console.log('logged in!');
            console.log('UID ', firebaseUser.uid);
            UserID = firebaseUser.uid;
            $("#bucket-list").empty();
            $("#bucket-list").append("<h2> My Bucket List </h2>");
            database.ref('users/' + UserID + '/parks').on("child_added", function (childSnapshot) {
                if (childSnapshot.val().visited === false) {

                    var newP = childSnapshot.val().name;
                    $(".pure-u-1-3").addClass("alt");

                    var parkName = childSnapshot.val().name;
                    var snapshotParent = childSnapshot.ref.getKey();
                    var newP = $('<p>').text(parkName);
                    var newButton = $("<button>").text('Visited')
                        .addClass('pure-button pure-button-primary visited-button');
                    var newDiv = $('<div>').attr('data-parent-ref', snapshotParent);
                    newDiv.append(newP)
                        .append(newButton)
                        .append('<br><br>');
                    $("#bucket-list").append(newDiv)
                }
            })
        } else {
            console.log('not logged in')
            $('#sign-out').addClass('hide');
        }
    })

    $('#sign-out').on('click', event => {
        firebase.auth().signOut();
        $("#bucket-list").empty();
        $("#bucket-list").append('<form class="pure-form pure-form-stacked"> <fieldset> <div class="sign-in-color">Sign-In</div> <label for="email">Email</label> <input id="email" type="email" placeholder="Email"> <label for="password">Password</label> <input id="password" type="password" placeholder="Password"> <button id="sign-in" type="submit" class="pure-button pure-button-primary">Sign in</button> <button id="sign-up" type="submit" class="button-secondary pure-button">Sign up</button> </fieldset> </form>');
    })

    $("#statelist").on('change', function () {
        $("#parkinfo").empty();
        var selectstate = $(this).val();
        // console.log(selectstate);
        var queryURL = "https://developer.nps.gov/api/v1/parks?stateCode=" + selectstate + "&api_key=GlsypCqWXX4ZbgvdJZXJULl2rnm4b18QkUM9oakw";

        $.ajax({
            url: queryURL,
            method: "GET"
        })

            .then(function (response) {
                for (var i = 0; i < response.data.length; i++) {
                    var parkname = $("<p>");
                    parkname.text(response.data[i].fullName);
                    parkname.addClass("natparks");
                    parkname.attr("id", response.data[i].parkCode);
                    parkname.data('park', response.data[i].parkCode)
                    $("#parkinfo").append(parkname);
                }
            });
    })

    // Add park to bucket list when button is pressed
    $('body').on('click', '#add-to-bucket', function (event) {
        console.log($(this).attr('data-park-name'));
        database.ref('users/' + UserID + '/parks').push({
            name: $(this).attr('data-park-name'),
            visited: false
        }) 
        // var parkName = $(this).attr('data-park-name');
        // $("#bucket-list").append("<p>" + parkName + "</p>");
    })

    // Change visited from false to true
    $('body').on('click', '.visited-button', function (event) {
        console.log($(this).parent().attr('data-parent-ref'));
        var parentRef = $(this).parent().attr('data-parent-ref')
        database.ref('users/' + UserID + '/parks/' + parentRef).update({
            visited: true
        })
        database.ref('users/' + UserID + '/parks/' + parentRef).on("value", function (snapshot) {
            if (snapshot.val().visited) {
                $('[data-parent-ref~=' + snapshot.ref.getKey() + ']').remove();
            }
        })
    })


})

$("body").on("click", ".natparks", function () {
    $("#parkinfo").empty();
    var parkcode = $(this).attr('id')
    // console.log(parkcode)
    var queryURL = "https://developer.nps.gov/api/v1/parks?parkCode=" + parkcode + "&api_key=GlsypCqWXX4ZbgvdJZXJULl2rnm4b18QkUM9oakw";

    $.ajax({
        url: queryURL,
        method: "GET"
    })

        .then(function (response) {
            console.log(response);
            $("#parkinfo").empty();
            addtolist = $("<button>");
            addtolist.attr("type", "button");
            addtolist.addClass("btn btn-primary");
            addtolist.text("Add to List");
            addtolist.attr("id", "add-to-bucket")
            addtolist.attr("data-park-name", response.data["0"].fullName);
            var parkname = response.data["0"].fullName;
            var parkdescription = response.data["0"].description;
            var parkwebsite = response.data["0"].url;
            var parkweather = response.data["0"].weatherInfo
            $("#parkinfo").append("<h2>" + parkname + "<h2>",
                "<p>" + parkdescription + "<p>",
                "<a href=" + parkwebsite + "></a>",
                "<a target='_blank' href=" + parkwebsite +">"+ parkwebsite +"</a>",
                "<p>" + parkweather + "<p>",
                addtolist);

            var apikey = "AIzaSyAWRVHG2OAqTmPVRW1n1bOKYhkvPzDkXEg";
            console.log(parkname);

            var queryURL = "https://www.googleapis.com/youtube/v3/search?&key=" + apikey + "&forUsername=GoTraveler" +
                "&part=snippet,id&q=" + parkname + "GoTraveler|National Geographic";

            $.ajax({
                url: queryURL,
                method: "GET",
                maxResults: '2',

            })

                .then(function (response) {
                    console.log(response);
                    var videoid = response.items["0"].id.videoId
                    var youtube = $("<iframe>");
                    youtube.attr({
                        id: "ytplayer",
                        type: "text/html",
                        width: "340",
                        height: "160",
                        src: "http://www.youtube.com/embed/" + videoid + "?autoplay=1",
                        frameborder: "0",
                    })
                    $("#parkinfo").prepend(youtube);
                });

        });

})









