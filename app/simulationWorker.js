(function() {
  "use strict";

    init();

    function init() {
      self.diameter = 10;
      self.header = 50;

      self.run = false;
      self.balls = [];
      self.increasing = false;
      self.lastLoop = new Date();

      self.addEventListener("message", listener);
    }

    function calculateBalls() {
      self.balls.forEach(function (b) {
        b.velocityX = b.velocityX * ((b.x < 0 || b.x + self.diameter > self.clientWidth) ? -1 : 1);
        b.velocityY = b.velocityY * ((b.y < self.header || b.y + self.diameter  >  self.clientHeight) ? -1 : 1);
        b.x = Math.round(b.x + b.velocityX);
        b.y = Math.round(b.y + b.velocityY);
      }.bind(self));

      if(self.fps > 30 && !self.increasing) {
        self.increasing = true;
        setTimeout(function() {
          self.balls = self.balls.concat(generateMultipleBalls(10));
          self.increasing = false;
        }.bind(self), 500);

      }


      if (self.run){
        self.postMessage({update: {balls: self.balls, fps: self.fps}});
        setTimeout(function() {
          calculateBalls();
        }, 1000 / 60);
        
      }

  }

  function generateMultipleBalls(number) {
    var balls = [];

    for(var i = 0; i < number; i++) {
      balls.push(generateBall());
    }

    return balls;
  }

  function generateBall() {
    var x, y, color, angle, speed;
    //x = Math.random() * 300 + 700;
    //y = Math.random() * 300 + 100;
    //x = document.body.clientWidth /2;
    //y = document.body.clientHeight /2;
    x = Math.random() * self.clientWidth;
    y = Math.random() * (self.clientHeight - self.header) + self.header;
    color = "#" + ((1 << 24) * Math.random() | 0).toString(16);
    angle = Math.round(Math.random() * 360);
    speed = Math.round(Math.random() * 50);
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

  function listener(event) {
    if(event.data.hasOwnProperty("initialState")) {
      self.balls = event.data.initialState.balls;
      self.diameter = event.data.initialState.diameter;
      self.header = event.data.initialState.header;
      self.clientHeight = event.data.initialState.clientHeight;
      self.clientWidth = event.data.initialState.clientWidth;
    } else if(event.data.hasOwnProperty("run")) {
      self.run = event.data.run;
      if(self.run)
        calculateBalls();
    }else if(event.data.hasOwnProperty("fps")){
      self.fps = event.data.fps;
    }
    
  }

}());
