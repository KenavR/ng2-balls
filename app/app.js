import { Component, Template, For } from 'angular2/angular2';
import { Ball } from 'ball/ball';
import { Controls } from 'controls/controls';
import { SimulationService } from 'simulationService';
import { SimulationWorkerService } from "simulationWorkerService";

@Component({
  selector: 'app',
  services: [SimulationService, SimulationWorkerService]
})
@Template({
  url: "app.html",
  directives: [For, Ball, Controls]
})

export class App {
  constructor(simulationService:SimulationService, simulationWorkerService:SimulationWorkerService) {
    this.service = simulationService;
  }
}