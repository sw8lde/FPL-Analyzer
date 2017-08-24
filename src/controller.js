var FPLAnalyzer = angular.module('FPLAnalyzer', [])
	.controller('FPLCtrl', ['$scope', '$window', function($scope, $window) {
		/* Functions */
		$scope.exportData = function() {
			const fileName = `Launch to Waiting for Customer ${$scope.formatDate(Date.now())}.csv`;
			let rows = [['Name', 'Uses', 'Cards from Launch to Waiting', 'Launch to Waiting for Customer Average']],
			labels = $scope.stats.labels;
			for(let id in labels) {
				if(labels.hasOwnProperty(id)) {
					rows.push([
						labels[id].name,
						labels[id].uses,
						labels[id].launchToWaitingCount,
						$scope.avgDays(labels[id].launchToWaitingCount,
							labels[id].launchToWaitingSum)
						]);
				}
			}

			exportToCSV(fileName, rows);
		}

		$scope.resetSearch = function() {
			$scope.search = {
				sort: 'web_name',
				limit: true,
				limitSize: 50,
				teams: { all: true },
				poss: { all: true }
			};
		}

		$scope.filter = function() {
			let filtered = [];

			$scope.data.elements.forEach(player => {
				let s = $scope.search,
				include = true;

				if(s.name &&
					player.web_name.toLowerCase().indexOf(s.name.toLowerCase()) === -1)
					include = false;

				if(!s.teams.all && !s.teams[player.team])
					include = false;

				if(!s.poss.all && !s.poss[player.element_type])
					include = false;

				if(include) filtered.push(player);
			});

			$scope.filteredPlayers = filtered;
		}

		/* Variables */
		$scope.resetSearch();

		$.ajax({
			type: 'GET',
			url: 'https://json2jsonp.com/?url=https://fantasy.premierleague.com/drf/bootstrap-static',
			dataType: 'jsonp',
			success: data => {
				$scope.data = data;
				$scope.filteredPlayers = data.elements;
				$scope.$digest();
				$scope.filter();
				$scope.$digest();
			},
			error: console.log
		});
	}]);
