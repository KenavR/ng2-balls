export class SimulationService {
  constructor() {
    this.run = false;
    this.balls = [];
    this.fps = 60;
    this.increasing = false;
    this.lastLoop = new Date();
    this.balls = this.generateMultipleBalls(10);

  }

  calculateBalls() {

    let thisLoop = new Date();
    this.fps = Math.ceil(1000 / (thisLoop - this.lastLoop));
    this.lastLoop = thisLoop;
    this.balls.forEach(function (b) {
      b.velocityX = b.velocityX * ((b.x < 0 || b.x + 10 > document.body.clientWidth) ? -1 : 1);
      b.velocityY = b.velocityY * ((b.y < 0 || b.y + 10  > document.body.clientHeight) ? -1 : 1);
      b.x = Math.ceil(b.x + b.velocityX);
      b.y = Math.ceil(b.y + b.velocityY);
      window.scrollTo(0, 0); //force layout recalc/repaint
    });

    if(this.fps > 30 && !this.increasing) {
      this.increasing = true;
      window.setTimeout(function() {
        this.balls = this.balls.concat(this.generateMultipleBalls(10));
        this.increasing = false;
      }.bind(this), 500);

    }


    if (this.run)
      window.requestAnimationFrame(this.calculateBalls.bind(this));
  }

  generateMultipleBalls(number) {
    let balls = [];

    for(let i = 0; i < number; i++) {
      balls.push(this.generateBall());
    }

    return balls;
  }

  generateBall() {
    let x, y, color, angle, speed;
    //x = Math.random() * 300 + 700;
    //y = Math.random() * 300 + 100;
    //x = document.body.clientWidth /2;
    //y = document.body.clientHeight /2;
    x = Math.random() * document.body.clientWidth;
    y = Math.random() * document.body.clientHeight;
    color = "#" + ((1 << 24) * Math.random() | 0).toString(16);
    angle = Math.ceil(Math.random() * 360);
    speed = Math.ceil(Math.random() * 50);
    //speed = 30;
    let ball = {
      "x": Math.ceil(x),
      "y": Math.ceil(y),
      "color": color,
      "angle": angle,
      "speed": speed,
      "velocityX": Math.cos(angle) * speed,
      "velocityY": Math.sin(angle) * speed
    };
    return ball;
  }
}

