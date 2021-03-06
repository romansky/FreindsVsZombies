var zombieInterval = 5000;

game.PlayScreen = me.ScreenObject.extend({

	hog : null,
	hogTo : null,

    init: function() {
        // add our player entity in the entity pool
        me.entityPool.add("friend1", game.FriendEntity);
        me.entityPool.add("friend2", game.FriendEntity);
        me.entityPool.add("friend3", game.FriendEntity);
        me.entityPool.add("zombie1", game.ZombieEntity, true);
        me.entityPool.add("zombie2", game.ZombieEntity, true);
        me.entityPool.add("zombie3", game.ZombieEntity, true);
        me.entityPool.add("zombie4", game.ZombieEntity, true);

		me.input.registerPointerEvent('mousedown', me.game.viewport, this.onStartEvent.bind(this));
    },

	onStartEvent: function (e) {
		if (me.state.current() !== this) {
			// We're still in title screen, ignore click
			return;
		}

		if (this.hog) {
			me.game.world.removeChild(this.hog);
			clearTimeout(this.hogTo);
			this.hog = null;
		}

		this.hog = new (me.AnimationSheet.extend({
			init: function() {
				this.parent(e.gameX - (64/2), e.gameY - (64/2), me.loader.getImage('hog'), 64, 64);
				this.addAnimation('running', [0,1,2,3,4], 100);
				this.setCurrentAnimation('running');
				this.z = 1000;
			}
		}));

		var playScreen = this;
		this.hogTo = setTimeout(function(){
			if (playScreen.hog && me.game.world.hasChild(playScreen.hog)) {
				me.game.world.removeChild(playScreen.hog);
				playScreen.hog = null;
				playScreen.hogTo = null;
			}
		},800);

		me.game.world.addChild(this.hog);

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

        setTimeout("createZombieLoop()", zombieInterval);
	},


	/**
	 *  action to perform when leaving this screen (state change)
	 */
	onDestroyEvent: function() {
		// remove the HUD from the game world
		me.game.world.removeChild(this.HUD);
	}
});

function createZombieLoop() {
    window.createZombie();

    setTimeout("createZombieLoop()", zombieInterval);
}

window.createZombie = function () {
	var group = me.game.currentLevel.getObjectGroups()[0];
	var zombieObject = _.find(group.objects, function isZombie(object) {
		return object.image === "zombie";
	});
	var entity = me.entityPool.newInstanceOf("zombie1", 416, 192, zombieObject);
	entity.z = group.z;
	me.game.world.addChild(entity);
};
