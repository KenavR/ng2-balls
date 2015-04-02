import {Component, Template} from 'angular2/angular2';

@Component({
  selector: 'ball',
  bind: {
    'data': 'data',
    'diameter': 'diameter'
  }
})
@Template({
  url: 'ball/ball.html'
})

export class Ball {
    constructor() {
    }

}
