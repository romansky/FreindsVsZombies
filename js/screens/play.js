game.PlayScreen = me.ScreenObject.extend({
    init: function() {
        // add our player entity in the entity pool
        me.entityPool.add("friend1", game.FriendEntity);
        me.entityPool.add("zombie1", game.ZombieEntity, true);
        me.entityPool.add("zombie2", game.ZombieEntity, true);
        me.entityPool.add("zombie3", game.ZombieEntity, true);
        me.entityPool.add("zombie4", game.ZombieEntity, true);
    },

	/**
	 *  action to perform on state change
	 */
	onResetEvent: function() {
        // load a level
        me.audio.playTrack("music");
        me.levelDirector.loadLevel("level01");

        // reset the score
		game.data.score = 0;

		// add our HUD to the game world
		this.HUD = new game.HUD.Container();
		me.game.world.addChild(this.HUD);

	},


	/**
	 *  action to perform when leaving this screen (state change)
	 */
	onDestroyEvent: function() {
		// remove the HUD from the game world
		me.game.world.removeChild(this.HUD);
	}
});
