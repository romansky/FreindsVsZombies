game.TitleScreen = me.ScreenObject.extend({
    // constructor
    init: function () {

        this.parent(true);

        // title screen image
        this.title = null;

        this.font = null;
        this.scrollerfont = null;
        this.scrollertween = null;

        this.scroller = "A SMALL STEP BY STEP TUTORIAL FOR GAME CREATION WITH MELONJS       ";
        this.scrollerpos = 600;
    },

    // reset function
    onResetEvent: function () {
        if (this.title == null) {
            // init stuff if not yet done
            this.title = me.loader.getImage("splash");

            // font to display the menu items
            this.font = new me.BitmapFont("32x32_font", 32);

            // set the scroller
            this.scrollerfont = new me.BitmapFont("32x32_font", 32);

        }

        // reset to default value
        this.scrollerpos = 640;

        // a tween to animate the arrow
        this.scrollertween = new me.Tween(this).to({
            scrollerpos: -2200
        }, 10000).onComplete(this.scrollover.bind(this)).start();

        // enable the keyboard
        me.input.bindKey(me.input.KEY.ENTER, "enter", true);

        // play something
        // me.audio.play("cling");

    },

    // some callback for the tween objects
    scrollover: function () {
        // reset to default value
        this.scrollerpos = 640;
        this.scrollertween.to({
            scrollerpos: -2200
        }, 10000).onComplete(this.scrollover.bind(this)).start();
    },

    // update function
    update: function () {
        var titleScreen = this;
        if (window.FB && !titleScreen.fbConnected && !titleScreen.waitingForResponse) {
            titleScreen.waitingForResponse = true;
			FB.getLoginStatus(function(response) {
				if (response.status == "connected") {
                    titleScreen.fbConnected = true;
                    me.input.registerPointerEvent(
                        'mousedown', 
                        me.game.viewport, 
                        titleScreen.onClick.bind(titleScreen)
                    );
				}
                titleScreen.waitingForResponse = false;
			});
        }
        return true;
    },

    onClick: function () {
        if (me.state.current() !== this) {
            // We're still in title screen, ignore click
            return;
        }
        $('#selectedFriendsPane').hide();
        me.state.change(me.state.PLAY);
    },

    // draw function
    draw: function (context) {
        context.drawImage(this.title, 0, 0);
        this.font.draw(context, "SAVE YOUR FRIENDS", 150, 100);
        if (this.fbConnected) {
            this.font.draw(context, "CLICK TO PLAY", 120, 380);
        } else {
            $('#fbLogin').show();
        }
        // this.scrollerfont.draw(context, this.scroller, this.scrollerpos, 440);
    },

    // destroy function
    onDestroyEvent: function () {
        me.input.unbindKey(me.input.KEY.ENTER);

        //just in case
        this.scrollertween.stop();
    }

});
