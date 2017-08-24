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

		$scope.toggleSort = function(col) {
			if(col.field === $scope.search.sort) {
				$scope.search.reverse = !$scope.search.reverse;
				$('#table .dir').eq(col.id).html(
					'<i class="material-icons">arrow_drop_' +
					($scope.search.reverse ? 'down':'up') + '</i>'
				);
			} else {
				$scope.search.sort = col.field;
				$scope.search.reverse = false;
				$('#table .dir').html('').eq(col.id).html(
					'<i class="material-icons">arrow_drop_up</i>'
				);
			}
		}

		$scope.resetTable = function() {
			$scope.search = {
				limit: true,
				limitSize: 50,
				sort: 'web_name',
				teams: { all: true },
				poss: { all: true }
			};

			$scope.cols = [
				{ id: 0, name: 'Name', field: 'web_name', show: true },
				{ id: 1, name: 'Team', field: 'team', show: true },
				{ id: 2, name: 'Pos', field: 'element_type', show: true },
				{ id: 3, name: 'Total points', field: 'total_points', show: true },
				{ id: 4, name: 'Form', field: 'form', show: true },
				{ id: 5, name: 'Price', field: 'now_cost', show: true },
			];
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

				if(((s.totalPtsStart || s.totalPtsStart == 0) && player.total_points < s.totalPtsStart) ||
						((s.totalPtsEnd || s.totalPtsEnd == 0) && player.total_points > s.totalPtsEnd &&
							s.totalPtsEnd >= (s.totalPtsStart || -99)))
						include = false;

				if(((s.formStart || s.formStart == 0) && player.form < s.formStart) ||
						((s.formEnd || s.formEnd == 0) && player.form > s.formEnd &&
							s.formEnd >= (s.formStart || -99)))
						include = false;

				if(include) filtered.push(player);
			});

			$scope.filteredPlayers = filtered;
		}

		/* Variables */
		$scope.resetTable();

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
