/**
 * Created by sagivigh on 1/25/14.
 */
game.ZombieEntity = me.ObjectEntity.extend({
    init: function(x, y, settings) {
        // call the constructor
        this.parent(x, y, settings);
        console.log('ZombieEntity.init, settings = ' + JSON.stringify(settings));

        this.framesOffLadder = 21;

        this.collidable = true;
        this.collisionBox.width = 16;
        this.doWalk(false);
        me.input.registerPointerEvent('mousedown', me.game.viewport, this.onStartEvent.bind(this));
    },

    doWalk: function (goLeft) {
        var xVelocity;
        if (goLeft === true) {
            this.chosenDirection = -1;
        } else if (goLeft === false) {
            this.chosenDirection = 1;
        } else if (this.chosenDirection === 0) {
            this.choseDirection();
        }
        this.setVelocity(1, 3);
        this.vel.x = this.getXVelocity();
        this.parent(this.chosenDirection === -1); // param = walk left
    },

    deterministicChoices: [1, 1, -1, 1, 1, 1],

    choseDirection: function () {
        this.chosenDirection = -1 + _.random(0, 1) * 2; // Randomize either -1 or 1
        // this.chosenDirection = this.deterministicChoices.shift();
        console.log('decided ' + this.chosenDirection);
    },

    getXVelocity: function () {
        return 1 * this.chosenDirection;
    },

    onStartEvent: function (e) {
        var c2 = Math.pow(e.gameX - this.pos.x, 2) + Math.pow(e.gameY - this.pos.y, 2);

        var c = Math.sqrt(c2);
        console.log(c);
        if (c < 80) {
            alert('you clicked me!!!');
        }
    },

    // Returns the current ladder, or undefined if we're not on a ladder
    getCurrentLadder: function () {
        var collision = this.collisionMap.checkCollision(this.collisionBox, this.vel);
        if (collision.yprop && collision.yprop.isLadder) {
            // console.log('collision = ' + JSON.stringify(collision));
            return collision.ytile;
        } else {
            // No ladder
            if (collision.xprop && collision.xprop.isSolid) {
                // We hit a wall
                this.chosenDirection *= -1;
                this.doWalk();
            }
            return undefined;
        }
    },

    stopWalk: function () {
        this.chosenDirection = 0;
        this.vel.x = 0;
    },

    /* -----

     update the player pos

     ------ */
    update: function() {
        var ladder = this.getCurrentLadder();

        if (ladder) {
            this.framesOnLadder += 1;
            if (this.vel.x !== 0 && ladder.pos.x === this.pos.x) {
                this.framesOffLadder = 0;
                this.stopWalk();
                this.doClimb(true);
            }
        } else {
            this.framesOnLadder = 0;
            this.framesOffLadder += 1;
            if (this.framesOffLadder === 1) {
                this.doWalk();
            }
            if (this.framesOffLadder === 20) {
                // We are now definitely off the ladder, start checking for the next one
                this.framesOnLadder = 0;
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
        // this.choseDirection();
        // this.doWalk();
        // return true;
        return false;
    }


});