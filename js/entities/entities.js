/*------------------- 
 a friend entity
 -------------------------------- */
game.FriendEntity = me.ObjectEntity.extend({

    /* -----

     constructor

     ------ */

    init: function(x, y, settings) {
        this.chosenDirection = 1; // right
        // call the constructor
        this.parent(x, y, settings);
        console.log('FriendEntity.init, settings = ' + JSON.stringify(settings));

        this.framesOnLadder = 0;
        this.framesOffLadder = 15;

        this.collidable = true;
        this.collisionBox.width = 16;
        this.doWalk();

    },

    doWalk: function (goLeft) {
        var xVelocity;
        if (this.chosenDirection === 0) {
            this.choseDirection();
        }
        this.setVelocity(1, 3);
        this.vel.x = this.getXVelocity();
        this.parent(this.chosenDirection === -1); // param = walk left
    },

    choseDirection: function () {
        this.chosenDirection = -1 + _.random(0, 1) * 2; // Randomize either -1 or 1
        console.log('decided ' + this.chosenDirection);
    },

    getXVelocity: function () {
        return 1 * this.chosenDirection;
    },

    /* -----

     update the player pos

     ------ */
    update: function() {

        if (this.onladder) {
            this.framesOnLadder += 1;
            if (this.framesOnLadder === 1) {
                this.framesOffLadder = 0;
                this.setVelocity(this.getXVelocity(), 1);
                this.doClimb(true);
            }
            if (this.framesOnLadder === 15) {
                console.log('undecide');
                this.chosenDirection = 0; // undecided
                this.doClimb(true);
                this.setVelocity(this.getXVelocity(), 1);
            }
        } else {
            this.framesOffLadder += 1;
            if (this.framesOffLadder === 1) {
                this.choseDirection();
                this.doWalk();
            }
            if (this.framesOffLadder === 20) {
                this.framesOnLadder = 0;
            }
        }
        if (this.initialX === this.pos.x) {
            this.chosenDirection = 1;
            this.doWalk();
        }

        // check & update player movement
        this.updateMovement();
        if (!this.initialX) {
            this.initialX = this.pos.x;
        }

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