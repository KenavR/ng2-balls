export class SimulationService {

  constructor() {
    //Init Values
    this.diameter = 10;
    this.header = 50;
    this.maxSpeed = 10;
    this.balls = [];
    
    //FPS calculation
    this.fps = 60;
    this.stack = 0;
    this.lastLoop = new Date();
    this.loop = 0;
    
    this.worker = new Worker("shared/simulationWorker.js");
    this.worker.addEventListener("message", this.workerMessageListener.bind(this), false);
    this.initWorker();
  }

  updateBalls(updatedBalls, callback) {
    var currentLoop = new Date();
    this.loop = (this.loop + 1) % 10;
    if(this.loop === 0) {
      this.fps = Math.round((1000 / (this.stack / 10))*10) / 10;
      this.stack = 0;
    }
    this.stack += (currentLoop - this.lastLoop);
    this.lastLoop = currentLoop;
    this.balls = updatedBalls;
    callback();

  }

  initWorker() {
    this.worker.postMessage({initialState: {
          header: this.header,
          diameter: this.diameter,
          clientWidth: document.body.clientWidth,
          clientHeight: document.body.clientHeight,
          maxSpeed: this.maxSpeed
    }});
  }

  startWorker() {
    this.run = true;
    this.worker.postMessage({run: true});
    this.worker.postMessage({"requestBalls": true, fps: this.fps});
  }

  stopWorker() {
    this.run = false;
     this.worker.postMessage({run: false});
    this.worker.removeEventListener("message", this.workerMessageListener.bind(this));
  }

  workerMessageListener(event) {
    if(event.data.hasOwnProperty("update")) {
      window.requestAnimationFrame(this.updateBalls.bind(this, event.data.update.balls, function() {
        if(this.run)
          this.worker.postMessage({"requestBalls": true, fps: this.fps});
      }.bind(this)));
    } else if(event.data.hasOwnProperty("out")) {
      console.log("Worker said: ", event.data);
    }
  }
}

