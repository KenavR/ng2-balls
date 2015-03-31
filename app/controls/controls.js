import {Component, Template} from 'angular2/angular2';
import {Inject} from 'angular2/di';
import { SimulationService } from 'simulationService';

@Component({
  selector: 'controls'
})
@Template({
  url: 'controls/controls.html'
})

export class Controls {
  constructor(@Inject(SimulationService)simulationService:SimulationService) {
    console.log("constructor");
    this.service = simulationService;
    this.worker = new Worker("../simulationWorker.js");
   

    this.worker.postMessage({initialState: {
          balls: this.service.balls, 
          header: this.service.header, 
          diameter: this.service.diameter,
          clientWidth: document.body.clientWidth,
          clientHeight: document.body.clientHeight
    }});
  }

  stop() {
    this.worker.postMessage({run: false});
  }

  start() {
    //this.service.run = true;
    //this.service.lastLoop = new Date();
    this.worker.addEventListener("message", function(event) {
      if(event.data.hasOwnProperty("update")) {
        //console.log("update", event.data.update);
        window.requestAnimationFrame(this.service.updateBalls.bind(this.service, event.data.update.balls));
        this.worker.postMessage({fps: this.service.fps});
      } else if(event.data.hasOwnProperty("out")) {
        console.log("Worker said: ", event.data);
      }
      
    }.bind(this), false);
    this.worker.postMessage({run: true});
  }
}
