class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        this.load.image('starfield', 'assets/starfield.png');
        this.load.image('sky', 'assets/sky.png');
        this.load.image('alien', 'assets/alien_ship.png');
        this.load.image('p1_rocket', 'assets/p1_rocket.png');
        this.load.image('p2_rocket', 'assets/p2_rocket.png');
        this.load.image('land', 'assets/land.png');
        this.load.spritesheet('explosion', './assets/explosion.png', 
        {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
        console.log(playerOne);
    }

    create() {

        this.sky = this.add.tileSprite(
            0,0,640,480, 'sky'
        ).setOrigin(0,0);

        this.land = this.add.tileSprite(
            0,350,800,100, 'land'
            ).setOrigin(0,0);

        if(playerOne % 2 == 0) {
            this.pRocket = new Rocket(
                this,
                game.config.width/2,
                game.config.height - borderUISize - borderPadding*1.5,
                'p1_rocket'
            );
        }
        else {
            this.pRocket = new Rocket(
                this,
                game.config.width/2,
                game.config.height - borderUISize - borderPadding,
                'p2_rocket'
            );
        }

        this.ship1 = new Ship(
            this,
            100,
            200,
            'alien'
        );

        this.ship2 = new Ship(
            this,
            300,
            240,
            'alien'
        );

        this.ship3 = new Ship(
            this,
            380,
            300,
            'alien'
        );

        // green UI background
        this.add.rectangle(
            0,
            borderUISize + borderPadding,
            game.config.width,
            borderUISize * 2,
            0x00FF00,
            ).setOrigin(0,0);

            // white borders
            this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0 ,0);
            this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0 ,0);
            this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0 ,0);
            this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0 ,0);

        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);   
        
        // animation config
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 9, first: 0}),
            frameRate: 30
        });

        // initialize score
        this.currentScore = 0;

        // initialize p1 score
        this.p1Score = 0;
        
        // initialize p2 score
        this.p2Score = 0;

        // display score
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
            top: 5,
            bottom: 5,
            },
            fixedWidth: 100
        }
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, this.currentScore, scoreConfig);

        // GAME OVER flag
        this.gameOver = false;

        // 60-second play clock
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(60000, () => {
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) for next or ← for Menu', scoreConfig).setOrigin(0.5);
            this.gameOver = true;
            if(playerOne % 2== 0) {
                this.p1Score = this.currentScore;
            }
            else {
                this.p2Score = this.currentScore;
            }
            if(this.p1Score > this.p2Score) {
                this.add.text(game.config.width/2, game.config.height/2 + 128, 'P1 in the lead!', scoreConfig).setOrigin(0.5);
            }
            else if(this.p1Score < this.p2Score) {
                this.add.text(game.config.width/2, game.config.height/2 + 128, 'P2 in the lead!', scoreConfig).setOrigin(0.5);
            }
            playerOne += 1;
        }, null, this);
    }

    update() {
        // check key input for restart
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            playerOne = 0;
            this.scene.start("menuScene");
        }
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
            this.scene.start("playScene");
        }

        this.sky.tilePositionX -= 4;

        if (!this.gameOver) {               
            this.pRocket.update();         // update rocket sprites
            this.ship1.update();           // update spaceships (x3)
            this.ship2.update();
            this.ship3.update();
        } 

        if(this.checkCollision(this.pRocket, this.ship1)) {
            this.pRocket.alpha = 0
            this.pRocket.reset();
            this.shipExplode(this.ship1)
        };
        if(this.checkCollision(this.pRocket, this.ship2)) {
            this.pRocket.alpha = 0
            this.pRocket.reset();
            this.shipExplode(this.ship2)
        };       
        if(this.checkCollision(this.pRocket, this.ship3)) {
            this.pRocket.alpha = 0
            this.pRocket.reset();
            this.shipExplode(this.ship3)
        };
    }

    checkCollision(rocket, Ship) {
        console.log(rocket);
        if( rocket.x + rocket.width > Ship.x &&
            rocket.x < Ship.x + Ship.width &&
            rocket.y + rocket.height > Ship.y &&
            rocket.y < Ship.y + Ship.height) {
                return true;
        } 
        else {
                return false;
            }

    }

    shipExplode(Ship) {
        // temporarily hide ship
        Ship.alpha = 0;
        // create explosion sprite at ship's position
        let boom = this.add.sprite(Ship.x, Ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode');             // play explode animation
        boom.on('animationcomplete', () => {    // callback after anim completes
          Ship.reset();                         // reset ship position
          Ship.alpha = 1;                       // make ship visible again
          boom.destroy();                       // remove explosion sprite
        }); 
        // score add and repaint
        this.currentScore += 1;
        this.scoreLeft.text = this.currentScore;  
        this.sound.play('sfx_explosion');    
      }
}