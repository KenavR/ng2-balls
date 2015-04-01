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
    this.service = simulationService;    
  }

  stop() {
    this.service.stopWorker();
  }

  start() {
    this.service.startWorker();
  }


}
