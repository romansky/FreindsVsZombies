/**
 * Created by sagivigh on 1/25/14.
 */
game.ZombieEntity = me.ObjectEntity.extend({
    init: function(x, y, settings) {
        // call the constructor
        settings.type = "zombie";
        this.parent(x, y, settings);
        console.log('ZombieEntity.init, settings = ' + JSON.stringify(settings));

        this.framesOffLadder = 21;

        this.collidable = true;
        this.collisionBox.width = 16;
        this.choseDirection();
        this.doWalk();
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
            console.log('Zombie touched by click');
            if (e.gameX < this.pos.x + 16) {
                // Click on our left, go right
                this.doWalk(false);
            } else {
                // Click on our fight, go left
                this.doWalk(true);
            }
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
        // check & update player movement
        this.updateMovement();

        // update animation if necessary
        if (this.vel.x !== 0 || this.vel.y !== 0) {
            // update object animation
            this.parent();
            return true;
        } else {
            this.choseDirection();
            this.doWalk();
        }

        // else inform the engine we did not perform
        // any update (e.g. position, animation)
        // this.choseDirection();
        // this.doWalk();
        // return true;
        return false;
    }


});