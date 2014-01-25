/**
 * User: Pavel 'PK' Kaminsky
 * Date: 1/24/14
 */

// Here we subscribe to the auth.authResponseChange JavaScript event. This event is fired
// for any authentication related change, such as login, logout or session refresh. This means that
// whenever someone who was previously logged out tries to log in again, the correct case below
// will be handled.

window.fbAsyncInit = function() {

    FB.init({
        appId: '611076678966646',
        status: true, // check login status
        cookie: true, // enable cookies to allow the server to access the session
        xfbml: true  // parse XFBML
    });

    FB.Event.subscribe('auth.authResponseChange', function (response) {
        console.log('authResponseChange, response = ' + response);
        // Here we specify what we do with the response anytime this event occurs.
        if (response.status === 'connected') {
            // The response object is returned with a status field that lets the app know the current
            // login status of the person. In this case, we're handling the situation where they
            // have logged in to the app.
            onConnected();
        } else if (response.status === 'not_authorized') {
            // In this case, the person is logged into Facebook, but not into the app, so we call
            // FB.login() to prompt them to do so.
            // In real-life usage, you wouldn't want to immediately prompt someone to login
            // like this, for two reasons:
            // (1) JavaScript created popup windows are blocked by most browsers unless they
            // result from direct interaction from people using the app (such as a mouse click)
            // (2) it is a bad experience to be continually prompted to login upon page load.
            FB.login();
            $('#fbLogin').show();
            $('#logout').hide();
        } else {
            // In this case, the person is not logged into Facebook, so we call the login()
            // function to prompt them to do so. Note that at this stage there is no indication
            // of whether they are logged into the app. If they aren't then they'll see the Login
            // dialog right after they log in to Facebook.
            // The same caveats as above apply to the FB.login() call here.
            FB.login();
            $('#fbLogin').show();
            $('#logout').hide();
        }
    });
    FB.Event.subscribe('auth.statusChange', function (response) {
        console.log('statusChange: ' + JSON.stringify(response));
    });
    FB.getLoginStatus(function (response) {
        console.log('getLoginStatus: ' + JSON.stringify(response));
    });


    $(function () {
        $('#logout').on('click', function myLogout() {
            FB.logout(function (response) {
                console.log('logout: ' + JSON.stringify(response));
            });
        });
    });

// Load the SDK asynchronously

    function onConnected() {
        $('#fbLogin').hide();
//        $('#logout').show();
//        $('#selectedFriendsPane h3').html('Selecting friends...');
        console.log('Welcome!  Fetching your information.... ');
        selectFriends();
    }

    function selectFriends() {
        FB.api('/me/friends', function (response) {
            // console.log('friends: ' + JSON.stringify(response, null, 4));
            var idx,
                friends = response.data,
                randomIndex,
                friendList = $('#selectedFriendsPane ul');
            window.selectedFriends = [];
            for (idx = 0; idx < 3; idx += 1) {
                randomIndex = _.random(0, friends.length - 1);
                window.selectedFriends.push(friends.splice(randomIndex, 1)[0]); // Extract one friend from the friend list and add to selectedFriends
            }
            $('#selectedFriendsPane h3').html('Selected friends:');
            friendList.empty();
            _.each(window.selectedFriends, function (friend, index) {
                console.log('Selected ' + friend.name);
                var src = 'http://graph.facebook.com/' + friend.id + '/picture?width=100&height=100';
                friendList.append('<img src="' + src + '" title="' + friend.name + '" />');
                $('#friend' + (index+1)).attr('src', src.replace(/100/g, '32'));
            });
        });
    }

    $('#fbLogin .button').click(function () {
		FB.login(function(response) {
			if (response.authResponse) {
				console.log('Welcome!  Fetching your information.... ');
				FB.api('/me', function(response) {
					console.log('Good to see you, ' + response.name + '.');
					onConnected();
				});
			} else {
				console.log('User cancelled login or did not fully authorize.');
			}
		});
    });
    // Execute some code here
};
