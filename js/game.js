/* game namespace */
var game = {

    /**
     * an object where to store game global data
     */
    data : {
        // score
        score : 0
    },

    zombieInterval: 1000,

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

        me.entityPool.add("zombie1", game.ZombieEntity, true);

        me.entityPool.add("zombie2", game.ZombieEntity, true);

        me.entityPool.add("zombie3", game.ZombieEntity, true);

        me.entityPool.add("zombie4", game.ZombieEntity, true);
        // setInterval(this.createZombie, this.zombieInterval);

        me.state.transition("fade", "#FFFFFF", 250);

        // enable the keyboard
        me.input.bindKey(me.input.KEY.LEFT,  "left");
        me.input.bindKey(me.input.KEY.RIGHT, "right");
        me.input.bindKey(me.input.KEY.X,     "jump", true);

        // Start the game.
        me.state.change(me.state.MENU);
        
    },

    createZombie: function() {
        var min = 1;
        var max = 4;
        var random = Math.floor(Math.random() * (max - min + 1)) + min;
        var zombieObj = me.entityPool.newInstanceOf("zombie" + random);
        me.game.remove(zombieObj);
        me.entityPool.add("zombie" + random, game.ZombieEntity,true);
    }
};
