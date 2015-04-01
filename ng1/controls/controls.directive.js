(function() {
  "use strict";

  function ControlsDirective(SimulationService) {
    return {
      restrict: "E",
      templateUrl: "controls/controls.html",
      link: function controlsLink(scope) {
        scope.start = start;
        scope.stop = stop;

        function stop() {
          SimulationService.stopWorker();
        }

        function start() {
          SimulationService.startWorker();
        }
      }
    }
  }

  angular
    .module("ngBalls")
    .directive("controls", ["SimulationService", ControlsDirective]);
}());