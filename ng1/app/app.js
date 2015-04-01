(function() {
	"use strict";

	function App(SimulationService) {
		return {
			restrict: "E",
			templateUrl: "app/app.html",
			link: function appLink(scope) {
				scope.service = SimulationService;
			}
		}
	}

	angular
	  .module("ngBalls", [])
	  .directive("app", ["SimulationService", App]);
}());