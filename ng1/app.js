(function() {
	"use strict";

	function App() {
		return {
			restrict: "E",
			templateUrl: "app.html",
			transclude: true
		}
	}

	angular.
	  .module("ng2Balls")
	  .directive("App", [App]);
}());