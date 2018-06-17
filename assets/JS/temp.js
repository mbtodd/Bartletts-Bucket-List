<<<<<<< HEAD
                var newP = childSnapshot.val().name;
                $("#bucket-list").append('<p>' + newP + '</p>');
                $(".pure-1-3").addClass("alt");
            })
            // $('#Sign-out').removeClass('hide');
            // database.ref('users/' + UserID).set({
            //     parkname 'dasf',
            //     email: 'asdf'
            // // some more user data
            // });
        } else {
            console.log('not logged in')
            // $('#Sign-out').addClass('hide');
        }
    })
    // firebase.auth().onAuthStateChanged(firebaseUser => {
    //console.log(firebaseUser);
    // if (firebaseUser) {
    // console.log(firebaseUser + 'logged in');
    //  console.log('UID', firebaseUser.uid);
    // UserID = firebaseUser.uid;
    // $('#Sign-out').removeClass('hide');
    // $("#bucket-list").empty();
    //if (!database.ref() {
    //  database.ref('users/' + userID).set({
    //    username: name,
    //  email: email
    //some more user data
    //});
    // }
    //} else {
    //  console.log('not logged in')
    // $('#Sign-out').addClass('hide');
    // }
    // })

    //})

    // Populate the sidebar with bucket list
    //function WriteSidebar(bucketListDB, UID) {

    //}
    $("#statelist").on("click", function () {