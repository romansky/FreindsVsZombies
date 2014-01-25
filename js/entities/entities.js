/*------------------- 
 a friend entity
 -------------------------------- */
game.FriendEntity = me.ObjectEntity.extend({

    /* -----

     constructor

     ------ */

    init: function (x, y, settings) {
        // call the constructor
        this.parent(x, y, settings);
        console.log('FriendEntity.init, settings = ' + JSON.stringify(settings));

        this.framesOnLadder = 0;
        this.framesOffLadder = 0;

        this.collidable = true;
        this.collisionBox.width = 16;
        this.setVelocity(0.5, 0);
        this.doWalk(false); // false = walk right

        me.input.registerPointerEvent('mousedown', me.game.viewport, this.onStartEvent.bind(this));

    },

    onStartEvent: function (e) {
        var c2 = Math.pow(e.gameX - this.pos.x, 2) + Math.pow(e.gameY - this.pos.y, 2);

        var c = Math.sqrt(c2);
        console.log(c);
        if (c < 80) {
            alert('you clicked me!!!');
        }

        if ((e.gameX >= this.pos.x - 10 && e.gameX <= this.pox.x + this.width + 10)
            && (e.gameY >= this.pos.y - 10 && e.gameY <= this.pos.y + this.height + 10))
            console.log("e: ", e);
        console.log("this: ", this);
    },
    /* -----

     update the player pos

     ------ */
    update: function () {

        if (this.onladder) {
            this.framesOnLadder += 1;
            this.framesOffLadder = 0;
            if (this.framesOnLadder === 3) {
                this.setVelocity(0, 3);
                this.doClimb(true);
            }
        } else {
            this.framesOnLadder = 0;
            this.framesOffLadder += 1;
            if (this.framesOffLadder === 3) {
                this.setVelocity(3, 0.1);
                this.doWalk(false);
            }
        }

        // check & update player movement
        this.updateMovement();

        // update animation if necessary
        if (this.vel.x !== 0 || this.vel.y !== 0) {
            // update object animation
            this.parent();
            return true;
        }


        // else inform the engine we did not perform
        // any update (e.g. position, animation)
        return false;
    }

});