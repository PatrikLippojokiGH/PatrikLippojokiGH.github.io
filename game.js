// Phaser scene configia varten
gameScene = new Phaser.Scene('gameScene')

gameScene.init = function() {
    gameover = false
    speedUp = -200
    start = false
    points = 0
    pos = [500,550,600,650,700]
}

gameScene.preload = function() {
    // ladataan tarvittavat tiedostot
    // this.preload.audio('ääni', 'assets/esim-ääni.wav)
    this.preload.image('bg','assets/background-day.png')
    this.preload.image('pipeUp','assets/pipe-green.png')
    this.preload.image('pipeDown','assets/pipe-green-down.png')
    this.preload.image('platform','assets/base.png')
    this.preload.image('bird0','assets/bluebird-midflap.png')
    this.preload.image('bird1','assets/bluebird-downflap.png')
    this.preload.image('bird2','assets/bluebird-upflap.png')
}

gameScene.create = function() {
    bg = this.add.tileSprite(0,0,800,600,'bg').setOrigin(0)
    bg.setInteractive()
    bg.depth = -2
    bg.on('pointerdown', function() {
        start = true
        playGame.visible = false
        if(gameover===false){
            pipes[0].setVelocityX(speedUp)
            pipes[1].setVelocityX(speedUp)
            flappyBird.setVelocityY(-300)
            flappyBird.play("flight") // animaatio
        } else {
            gameover = false
            speedUp = -200
            flappyBird.y = 300
            pipes[0].x = 800
            pipes[0].setVelocityX(-200)
            pipes[1].x = 800
            flappyBird.angle = 0
            points = 0
            pipesPassed.setText('Points: '+points)
        }
    })
    playGame = this.add.text(100,0,'Click\nTo\nStart',{fontSize:'68px'})
    pipesPassed = this.add.text(600,0,'Points: '+points, {fontSize:'20px'})
    ghostplatform = this.physics.add.sprite(800,565,'ghostplatform').setOrigin()
    ghostplatform.setScale(100,0.5)
    ghostplatform.body.allowGravity=false
    ghostplatform.setImmovable(true)
    platform = this.add.tileSprite(400,565,800,150, 'platform').setOrigin()
    platform.setScale(1,0.5)

    // Animaatio linnulle
    this.anims.create({
        key: "flight",
        frames: [
            { key: "bird0" },
            { key: "bird1" },
            { key: "bird0" },
            { key: "bird2" },
        ],
        frameRate: 20,
        repeat: -1
    })

    flappyBird = this.physics.add.sprite(150,300,'bird0')
    flappyBird.setSize(75,75)
    flappyBird.setCollideWorldBounds(true)

    // Luodaan kaksi putkea sisältävä joukko
    pipe = this.physics.add.group({
        key:'pipeUp',
        repeat:1
    })
    pipes = pipe.getChildren()
    for(var i=0;i<pipes.length;i++) {
        pipes[i].body.allowGravity=false
        pipes[i].body.immovable=true
        pipes[i].setOrigin()
        // toinen putki ylösalaisin
        pipes[1].flipY = true
        pipes[i].depth = -1
        pipes.setVelocityX(-300)
        pipes[0].y = pos[Phaser.Math.Between(0,4)]
        pipes[0].x = 800
        pipes[1].y = pipes[0].y-650
        pipes[1].x = pipes[0].x
    }

    // Asetetaan colliderit putkille ja maalle
    this.physics.add.collider(ghostplatform,flappyBird,this.hitPlatform,null,this)
    this.physics.add.collider(pipe,flappyBird,this.hitPipe,null,this)


}

gameScene.hitPlatform = function(p1,p2) {
    if(p2===flappyBird) {
        gameOver = true
    }
}

gameScene.hitPipe = function(p1,p2) {
    if(p2===flappyBird) {
        gameOver = true
    }
}

gameScene.update = function() {
    if(start===false) {
        flappyBird.y = 300
        flappyBird.setVelocityY(0)
        pipes[0].setVelocityX(0)
        pipes[1].setVelocityX(0)
    } else {

        if(gameOver===false) {
            bg.tilePositionX+=0.1
            platform.TilePositionX+=5
            pipes[1].y = pipes[0].y-650
            pipes[1].x = pipes[0].x

            if(pipes[0].x <= -50) {
                speedUp -= 50
                pipes[0].x = 850
                pipes[0].y = pos[Phaser.Math.Between(0,4)]
                pipes[0].setVelocityX(speedUp)
            }

        } else {
            pipes[0].setVelocityX(0)
            pipes[0].setVelocityY(0)
            flappyBird.setVelocityX(0)
            if(flappyBird.angle != 90) {
                flappyBird.angle += 10
            }
        }

    }
}

// Config Phaser peliä varten
var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 700},
            debug: false
        }
    },
    scene: gameScene
}

var game = new Phaser.Game(config)