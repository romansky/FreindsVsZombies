/* game namespace */
var game = {

    /**
     * an object where to store game global data
     */
    data : {
        // score
        score : 0
    },

    // Run on page load.
    "onload" : function () {

        // Initialize the video.
        if (!me.video.init("screen", 800, 576, true)) {
            alert("Your browser does not support HTML5 canvas.");
            return;
        }

        // add "#debug" to the URL to enable the debug Panel
        // if (document.location.hash === "#debug") {
        //     window.onReady(function () {
        //         me.plugin.register.defer(debugPanel, "debug");
        //     });
        // }

        // Initialize the audio.
        me.audio.init("mp3");

        // Set a callback to run when loading is complete.
        me.loader.onload = this.loaded.bind(this);

        // Load the resources.
        me.loader.preload(game.resources);

        // Initialize melonJS and display a loading screen.
        me.state.change(me.state.LOADING);
    },



    // Run on game resources loaded.
    "loaded" : function () {
        me.state.set(me.state.MENU, new game.TitleScreen());
        me.state.set(me.state.PLAY, new game.PlayScreen());
        // add our player entity in the entity pool
        me.entityPool.add("friend1", game.FriendEntity);
        me.entityPool.add("zombie1", game.ZombieEntity);
        me.state.transition("fade", "#FFFFFF", 250);

        // enable the keyboard
        me.input.bindKey(me.input.KEY.LEFT,  "left");
        me.input.bindKey(me.input.KEY.RIGHT, "right");
        me.input.bindKey(me.input.KEY.X,     "jump", true);

        // Start the game.
        me.state.change(me.state.MENU);
        
    }
};
