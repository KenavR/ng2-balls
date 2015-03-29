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
    this.service = simulationService;
  }

  stop() {
    this.service.run = false;
  }

  start() {
    this.service.run = true;
    this.service.lastLoop = new Date();
    window.requestAnimationFrame(this.service.calculateBalls.bind(this.service));
  }
}
