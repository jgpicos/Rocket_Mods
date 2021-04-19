class Ship extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
    }

    update() {
        this.x -= game.settings.spaceshipSpeed;;
        if(this.x < -this.width) {
            this.x = game.config.width + Math.random()*500;
            this.y= (Math.random() * (350 - 110) + 110);
        }
    }

    reset() {
        this.x = game.config.width + 50;
        this.alpha = 1;
    }
}