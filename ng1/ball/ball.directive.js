(function() {
  "use strict";

  function BallDirective() {
    return {
      restrict: "E",
      templateUrl: "ball/ball.html",
      scope: {
        data: "=",
        diameter: "="
      },
      link: function ballLink(scope) {
      }
    }
  }

  angular
    .module("ngBalls")
    .directive("ball", [BallDirective]);
}());