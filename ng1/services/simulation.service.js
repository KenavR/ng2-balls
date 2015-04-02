(function() {
  "use strict";

  function SimulationService($rootScope) {
    var service = {
      startWorker: startWorker,
      stopWorker: stopWorker,
      updateBalls: updateBalls
    }
    init();
    return service;

    function init() {
      //Init Values
      service.diameter = 10;
      service.header = 50;
      service.maxSpeed = 10;
      service.balls = [];

      //FPS calculation
      service.fps = 60;
      service.lastLoop = new Date();
      service.stack = 0;
      service.loop = 0;

      service.worker = new Worker("shared/simulationWorker.js");
      service.worker.addEventListener("message", workerMessageListener.bind(service), false);
      initWorker();
    }

    function updateBalls(updatedBalls, callback) {
      var currentLoop = new Date();
      service.loop = (service.loop + 1) % 10;
      if(service.loop === 0) {
        service.fps = Math.round((1000 / (service.stack / 10))*10) / 10;
        service.stack = 0;
      }
      service.stack += (currentLoop - this.lastLoop);
      service.lastLoop = currentLoop;
      $rootScope.$apply(function() {
        service.balls = updatedBalls;
      });
      callback();
    }

    function initWorker() {
      service.worker.postMessage({initialState: {
        header: service.header,
        diameter: service.diameter,
        clientWidth: document.body.clientWidth,
        clientHeight: document.body.clientHeight,
        maxSpeed: service.maxSpeed
      }});
    }

    function startWorker() {
      service.run = true;
      service.worker.postMessage({run: true});
      service.worker.postMessage({"requestBalls": true, fps: service.fps});
    }

    function stopWorker() {
      service.run = false;
      service.worker.postMessage({run: false});
      service.worker.removeEventListener("message", workerMessageListener.bind(service));
    }

    function workerMessageListener(event) {
      if(event.data.hasOwnProperty("update")) {
        window.requestAnimationFrame(updateBalls.bind(service, event.data.update.balls, function() {
          if(service.run)
            service.worker.postMessage({"requestBalls": true, fps: service.fps});
        }.bind(service)));
      } else if(event.data.hasOwnProperty("out")) {
        console.log("Worker said: ", event.data);
      }
    }
  }

  angular
    .module("ngBalls")
    .factory("SimulationService", ["$rootScope", SimulationService]);
}());