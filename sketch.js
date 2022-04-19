//asteroid clone (core mechanics only)
//arrow keys to move + x to shoot

var bullets;
var asteroids;
var ship;
var shipImage, bulletImage, particleImage;

var MARGIN = 40;
let noiseMax = 5;
let aoff = 0;
var inc = 0.1;
var scl = 10;
var cols, rows;
let landscape;

var zoff = 0;

var fr;

var particles = [];

var flowfield;

function preload (){
  landscape = loadImage('egyptt.png')
}



function setup() {
  createCanvas(700, 600);
  bulletImage = loadImage('asteroids_bullet.png');
  shipImage = loadImage('asteroids_ship0001.png');
  particleImage = loadImage('asteroids_particle.png');

  ship = createSprite(width/2, height/2);
  ship.maxSpeed = 6;
  ship.friction = 0.98;
  ship.setCollider('circle', 0, 0, 20);

  ship.addImage('normal', shipImage);
  ship.addAnimation('thrust', 'asteroids_ship0002.png', 'asteroids_ship0007.png');

  asteroids = new Group();
  bullets = new Group();

  for(var i = 0; i<8; i++) {
    var ang = random(360);
    var px = width/2 + 1000 * cos(radians(ang));
    var py = height/2+ 1000 * sin(radians(ang));
    createAsteroid(3, px, py);
  }
}

function draw() {
  background(landscape);
  fill(123, 3, 252);
  textAlign(CENTER);
  text('Controls: Arrow Keys + X', width/2, 20);

  push()
  translate(width/2, height/2);
stroke(182, 66, 245, 150);
strokeWeight(40)
noFill();
beginShape();
for (let a = 0; a < TWO_PI; a += 0.001) {
  let xoff = map(cos(a), -1, 1, 0, noiseMax) +
             map(cos(aoff), -1, 1, 0, noiseMax);
  let yoff = map(sin(a), -1, 1, 0, noiseMax) +
             map(sin(aoff), -1, 1, 0, noiseMax);
  let r = map(noise(xoff, yoff), 0, 1, 100, 700);
  let x = r * cos(a);
  let y = r * sin(a);
  vertex(x, y);
}
endShape(CLOSE);
aoff += 0.01;
   pop()

   push()
   translate(width/2, height/2);
 stroke(3, 140, 252, 150);
 strokeWeight(40)
 noFill();
 beginShape();
 for (let a = 0; a < TWO_PI; a += 0.001) {
   let xoff = map(cos(a), -1, 1, 0, noiseMax) +
              map(cos(aoff), -1, 1, 0, noiseMax);
   let yoff = map(sin(a), -1, 1, 0, noiseMax) +
              map(sin(aoff), -1, 1, 0, noiseMax);
   let r = map(noise(xoff, yoff), 0, 1, 200, 700);
   let x = r * cos(a);
   let y = r * sin(a);
   vertex(x, y);
 }
 endShape(CLOSE);
 aoff += 0.01;
    pop()

    push()
    translate(width/2, height/2);
   stroke(182, 66, 245, 150);
   strokeWeight(40)
   noFill();
   beginShape();
   for (let a = 0; a < TWO_PI; a += 0.001) {
    let xoff = map(cos(a), -1, 1, 0, noiseMax) +
               map(cos(aoff), -1, 1, 0, noiseMax);
    let yoff = map(sin(a), -1, 1, 0, noiseMax) +
               map(sin(aoff), -1, 1, 0, noiseMax);
    let r = map(noise(xoff, yoff), 0, 1, 300, 700);
    let x = r * cos(a);
    let y = r * sin(a);
    vertex(x, y);
   }
   endShape(CLOSE);
   aoff += 0.01;
     pop()

     push()
     translate(width/2, height/2);
    stroke(3, 140, 252, 150);
    strokeWeight(40)
    noFill();
    beginShape();
    for (let a = 0; a < TWO_PI; a += 0.001) {
     let xoff = map(cos(a), -1, 1, 0, noiseMax) +
                map(cos(aoff), -1, 1, 0, noiseMax);
     let yoff = map(sin(a), -1, 1, 0, noiseMax) +
                map(sin(aoff), -1, 1, 0, noiseMax);
     let r = map(noise(xoff, yoff), 0, 1, 400, 700);
     let x = r * cos(a);
     let y = r * sin(a);
     vertex(x, y);
    }
    endShape(CLOSE);
    aoff += 0.01;
      pop()
  for(var i=0; i<allSprites.length; i++) {
    var s = allSprites[i];
    if(s.position.x<-MARGIN) s.position.x = width+MARGIN;
    if(s.position.x>width+MARGIN) s.position.x = -MARGIN;
    if(s.position.y<-MARGIN) s.position.y = height+MARGIN;
    if(s.position.y>height+MARGIN) s.position.y = -MARGIN;
  }

  asteroids.overlap(bullets, asteroidHit);

  ship.bounce(asteroids);

  if(keyDown(LEFT_ARROW))
    ship.rotation -= 4;
  if(keyDown(RIGHT_ARROW))
    ship.rotation += 4;
  if(keyDown(UP_ARROW))
  {
    ship.addSpeed(0.2, ship.rotation);
    ship.changeAnimation('thrust');
  }
  else
    ship.changeAnimation('normal');

  if(keyWentDown('x'))
  {
    var bullet = createSprite(ship.position.x, ship.position.y);
    bullet.addImage(bulletImage);
    bullet.setSpeed(10+ship.getSpeed(), ship.rotation);
    bullet.life = 30;
    bullets.add(bullet);
  }

  drawSprites();
}

function createAsteroid(type, x, y) {
  var a = createSprite(x, y);
  var img = loadImage('asteroid'+floor(random(0, 3))+'.png');
  a.addImage(img);
  a.setSpeed(2.5-(type/2), random(360));
  a.rotationSpeed = 0.5;
  //a.debug = true;
  a.type = type;

  if(type == 2)
    a.scale = 0.6;
  if(type == 1)
    a.scale = 0.3;

  a.mass = 2+a.scale;
  a.setCollider('circle', 0, 0, 50);
  asteroids.add(a);
  return a;
}

function asteroidHit(asteroid, bullet) {
  var newType = asteroid.type-1;

  if(newType>0) {
    createAsteroid(newType, asteroid.position.x, asteroid.position.y);
    createAsteroid(newType, asteroid.position.x, asteroid.position.y);
  }

  for(var i=0; i<10; i++) {
    var p = createSprite(bullet.position.x, bullet.position.y);
    p.addImage(particleImage);
    p.setSpeed(random(3, 5), random(360));
    p.friction = 0.95;
    p.life = 15;
  }

  bullet.remove();
  asteroid.remove();
}
