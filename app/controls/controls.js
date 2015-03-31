import {Component, Template} from 'angular2/angular2';
import {Inject} from 'angular2/di';
import {SimulationService} from 'simulationService';

@Component({
  selector: 'controls'
})
@Template({
  url: 'controls/controls.html'
})

export class Controls {
  constructor(@Inject(SimulationService)simulationService:SimulationService) {
    console.log("constructor");
    this.run = false;
    this.service = simulationService;
    this.worker = new Worker("../simulationWorker.js");
    this.worker.postMessage({initialState: {
          balls: this.service.balls,
          header: this.service.header,
          diameter: this.service.diameter,
          clientWidth: document.body.clientWidth,
          clientHeight: document.body.clientHeight,
          maxSpeed: this.service.maxSpeed
    }});
  }

  stop() {
    this.run = false;
    this.worker.postMessage({run: false});
    this.worker.removeEventListener("message", this.workerMessageListener.bind(this));
  }

  start() {
    //this.service.run = true;
    //this.service.lastLoop = new Date();
    this.run = true;
    this.worker.addEventListener("message", this.workerMessageListener.bind(this), false);
    this.worker.postMessage({run: true});
    this.worker.postMessage({"requestBalls": true, fps: this.service.fps});
  }

  workerMessageListener(event) {
    if(event.data.hasOwnProperty("update")) {
      //console.log("update", event.data.update);
      window.requestAnimationFrame(this.service.updateBalls.bind(this.service, event.data.update.balls, function() {
        if(this.run)
          this.worker.postMessage({"requestBalls": true, fps: this.service.fps});
      }.bind(this)));
    } else if(event.data.hasOwnProperty("out")) {
      console.log("Worker said: ", event.data);
    }
  }
}
