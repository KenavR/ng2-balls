export class SimulationService {

  constructor() {
    this.diameter = 20;
    this.header = 50;

    this.balls = [];
    this.fps = 60;
    this.balls = this.generateMultipleBalls(10);
    this.lastLoop = new Date();
  }

  updateBalls(updatedBalls) {
    var currentLoop = new Date();
    this.fps = Math.round(1000 / (currentLoop - this.lastLoop));
    this.lastLoop = currentLoop;
    this.balls = updatedBalls;
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
    x = Math.random() * (document.body.clientWidth-10) + 10;
    y = Math.random() * (document.body.clientHeight - this.header) + this.header;
    color = "#" + ((1 << 24) * Math.random() | 0).toString(16);
    angle = Math.round(Math.random() * 360);
    speed = Math.round(Math.random() * 20);
    //speed = 15;
    let ball = {
      "x": Math.round(x),
      "y": Math.round(y),
      "color": color,
      "angle": angle,
      "speed": speed,
      "velocityX": Math.cos(angle) * speed,
      "velocityY": Math.sin(angle) * speed
    };
    return ball;
  }
}

