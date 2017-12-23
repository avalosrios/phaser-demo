/* globals __DEV__ */
import Phaser from 'phaser';
import Star from '../sprites/Star';
import Player from '../sprites/Player';

export default class extends Phaser.State {
  init () {
    console.log('init');
    this.score = 0;
  }
  preload () {}

  create () {
    //  We're going to be using physics, so enable the Arcade Physics system
    this.physics.startSystem(Phaser.Physics.ARCADE);

    //  A simple background for our game
    this.add.sprite(0, 0, 'city');

    //  The platforms group contains the ground and the 2 ledges we can jump on
    this.platforms = this.add.group();

    //  We will enable physics for any object that is created in this group
    this.platforms.enableBody = true;

    // Here we create the ground.
    const ground = this.platforms.create(0, this.world.height - 64, 'ground');

    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    ground.scale.setTo(2, 2);

    //  This stops it from falling away when you jump on it
    ground.body.immovable = true;

    //  Now let's create two ledges
    let ledge = this.platforms.create(400, 400, 'ground');

    ledge.body.immovable = true;

    ledge = this.platforms.create(-150, 250, 'ground');

    ledge.body.immovable = true;

    this.player = new Player({
      game: this.game,
      x: 32,
      y: this.game.world.height - 150,
      asset: 'dude'
    });
    //
    this.game.add.existing(this.player);

    //  Finally some stars to collect
    this.stars = this.game.add.group();

    //  We will enable physics for any star that is created in this group
    this.stars.enableBody = true;
    //
    // //  Here we'll create 12 of them evenly spaced apart
    for (let i = 0; i < 12; i++) {
    //   //  Create a star inside of the 'stars' group
      const star = new Star({
        game: this.game,
        x: i * 70,
        y: 0,
        asset: 'star'
      });
      this.stars.add(star);
      star.body.gravity.y = 300;
      //  This just gives each star a slightly random bounce value
      star.body.bounce.y = 0.7 + Math.random() * 0.2;
    }

    this.cursors = this.game.input.keyboard.createCursorKeys();

    const bannerText = 'Gadiel Game';
    let banner = this.add.text(this.world.centerX, this.game.height - 40, bannerText, {
      font: '40px Bangers',
      fill: '#77BFA3',
      smoothed: false
    });

    banner.padding.set(10, 16);
    banner.anchor.setTo(0.5);

    this.scoreText = this.game.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' });
  }

  collectStar (player, star) {
    star.kill();
    // Adds points per star to the score
    this.score += 5; // points per star
    this.scoreText.text = `Score: ${this.score}`;
  }

  update () {
    //  Collide the player and the stars with the platforms
    this.game.physics.arcade.collide(this.player, this.platforms);
    this.game.physics.arcade.collide(this.stars, this.platforms);

    //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
    this.game.physics.arcade.overlap(this.player, this.stars, this.collectStar, null, this);

    this.player.body.velocity.x = 0;

    if (this.cursors.left.isDown) {
      //  Move to the left
      this.player.body.velocity.x = -150;

      this.player.animations.play('left');
    } else if (this.cursors.right.isDown) {
      //  Move to the right
      this.player.body.velocity.x = 150;

      this.player.animations.play('right');
    } else {
      //  Stand still
      this.player.animations.stop();

      this.player.frame = 4;
    }

    //  Allow the player to jump if they are touching the ground.
    if (this.cursors.up.isDown && this.player.body.touching.down) {
      this.player.body.velocity.y = -350;
    }
  }

  render () {
    if (__DEV__) {
      // this.game.debug.spriteInfo(this.star, 32, 32);
    }
  }
}
