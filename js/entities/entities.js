/*------------------- 
 a friend entity
 -------------------------------- */
window.helicopterDoorSize = 0;

game.FriendEntity = me.ObjectEntity.extend({

    /* -----

     constructor

     ------ */

    init: function (x, y, settings) {
        // call the constructor
        this.parent(x, y, settings);
        console.log('FriendEntity.init, settings = ' + JSON.stringify(settings));

        this.friendNumber = settings.name.replace('friend', '');
        this.friendImage = $('#friend' + this.friendNumber);
        this.melonCanvas = $('canvas');
        this.friendImage.show();
        this.framesOffLadder = 21;

        this.collidable = true;
        this.collisionBox.width = 16;
        this.doWalk(false);
        me.input.registerPointerEvent('mousedown', me.game.viewport, this.onStartEvent.bind(this));
    },

    doWalk: function (goLeft) {
        var xVelocity,
            currentDirection;
        if (goLeft === true) {
            this.chosenDirection = -1;
        } else if (goLeft === false) {
            this.chosenDirection = 1;
        } else if (this.chosenDirection === 0) {
            this.choseDirection();
        }
        this.setVelocity(1, 3);
        this.vel.x = this.getXVelocity();
        currentDirection = (this.chosenDirection === -1); // true if left, false if right
        if (this.previousDirection !== currentDirection) {
            this.parent(currentDirection); // param = walk left
            this.previousDirection = currentDirection;
        }
    },

    deterministicChoices: [1, 1, 1, -1, 1, 1],

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
        if (c < 80 && !this.onladder) {
            console.log('Friend touched by click');
            if (e.gameX < this.pos.x + 16) {
                // Click on our left, go right
                this.doWalk(false);
            } else {
                // Click on our fight, go left
                this.doWalk(true);
            }
        }
    },

    // Returns the current ladder, or undefined if we're not on a ladder
    getCurrentLadder: function () {
        var collision = this.collisionMap.checkCollision(this.collisionBox, this.vel);
        if (collision.yprop && (collision.yprop.isLadder || collision.yprop.isTopLadder)) {
            // console.log('collision = ' + JSON.stringify(collision));
            return _.extend(collision.ytile, collision.yprop);
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
        this.friendImage.css('left', this.pos.x + this.melonCanvas.offset().left);
        this.friendImage.css('top', this.pos.y + this.melonCanvas.offset().top - 40);
        if (this.collide()) {
            if (!this.gameOver) {
                alert('Friend killed! Game over!');
                this.gameOver = true;
                me.levelDirector.reloadLevel();
            }
            return;
        }
        if (this.safe) {
            return;
        }
        if (this.pos.y < 70 && Math.abs(this.pos.x - 540) <= window.helicopterDoorSize) {
            // We're at the helicopter
            console.log('a friend reached the helicopter');
            this.safe = true;
            window.helicopterDoorSize += 10; // So the next friend stops a bit sooner
            return;
        }
    
        var ladder = this.getCurrentLadder();

        if (ladder) {
            if (!ladder.isTopLadder) {
                // Normal ladder
                if (this.vel.x !== 0 && ladder.pos.x === this.pos.x) {
                    this.framesOffLadder = 0;
                    this.stopWalk();
                    this.doClimb(true);
                }
            } else {
                // Top ladder
                if (this.chosenDirection === 0 && ladder.pos.y > this.pos.y) { // y axis is down, check that we're above ladder
                    // this.vel.y = 0;
                    this.doWalk();
                }
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