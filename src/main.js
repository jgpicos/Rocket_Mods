/* 
Jesus Picos, Rocket Patrol Mods, April 19 2021, took ~10

Point Break down: 
    5:
        -New Scrolling Background
        -Player controlled rocket (left right when firing)
    
    10: 
        -Display time remaining
        -New animated sprite of ships (collisions?)
        -Paralax scrolling

    20: 
        -New Smaller spaceships worth more
        -Alternating 2 players
        -Shooting enemies increases time
    
    Total: 
        100
*/

let config = {
    type: Phaser.CANVAS,
    width: 640,
    height: 480,
    scene: [Menu, Play],
}

let game = new Phaser.Game(config);

let playerOne = 0;
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;

let keyLEFT, keyRIGHT, keyF, keyR;