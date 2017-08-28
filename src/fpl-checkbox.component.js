(function() {
  'use strict';

  angular
  	.module('FPLAnalyzer')
    .component('fplCheckbox', {
    bindings: {
      model: '=',
      change: '&'
    },
    controller: ctrl,
    controllerAs: 'vm',
    template: `
      <label><input type="checkbox" ng-model="vm.model" ng-change="vm.update()">
        <i class="material-icons on">check_box</i>
        <i class="material-icons off">check_box_outline_blank</i>
      </label>
    `
  });

  ctrl.$inject = ['$timeout'];
  function ctrl($timeout) {
    this.update = () => {
      // use $timeout so change is called with the new value
      $timeout(this.change);
    }
  }
})();
