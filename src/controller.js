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

		$scope.showPopup = function(player) {
			$scope.popupPlayer = player;
			$scope.popupPlayer.url =
				'https://platform-static-files.s3.amazonaws.com/' +
				'premierleague/photos/players/110x140/p' +
				player.photo.slice(0, -4) + '.png';
			$('#blur').fadeIn(200);
		}

		$scope.resetTable = function() {
			$scope.search = {
				limit: true,
				limitSize: 50,
				sort: 'total_points',
				reverse: true,
				teams: { all: true },
				poss: { all: true }
			};

			$scope.cols = [
				{ id: 0, name: 'Name', field: 'web_name', show: true },
				{ id: 1, name: 'Team', field: 'team', show: true },
				{ id: 2, name: 'Pos', field: 'element_type', show: true },
				{ id: 3, name: 'Total Points', field: 'total_points', show: true },
				{ id: 4, name: 'GW Points', field: 'event_points', show: true },
				{ id: 5, name: 'PPG', field: 'points_per_game', show: false },
				{ id: 6, name: 'PPMil', field: 'value_season', show: false },
				{ id: 7, name: 'Form', field: 'form', show: true },
				{ id: 8, name: 'FPMil', field: 'value_form', show: false },
				{ id: 9, name: 'Price', field: 'now_cost', show: true },
				{ id: 10, name: 'VAPMil', field: 'value_added_per_mil', show: true },
				{ id: 11, name: 'Minutes', field: 'minutes', show: true },
				{ id: 12, name: 'Transfers In', field: 'transfers_in', show: false },
				{ id: 13, name: 'Transfers Out', field: 'transfers_out', show: false },
				{ id: 14, name: 'Net Transfers', field: 'transfers_in - transfers_out', show: false },
				{ id: 15, name: 'Transfers In (GW)', field: 'transfers_in_event', show: false },
				{ id: 16, name: 'Transfers out (GW)', field: 'transfers_out_event', show: false },
				{ id: 17, name: 'Net Transfers (GW)', field: 'transfers_in_event - transfers_out_event', show: false },
				{ id: 18, name: 'Selected By', field: 'selected_by_percent', show: true },
				{ id: 19, name: 'Cost Change', field: 'cost_change_start', show: true },
				{ id: 20, name: 'Cost Change (GW)', field: 'cost_change_event', show: true },
				{ id: 21, name: 'ICT', field: 'ict_index', show: false },
				{ id: 22, name: 'Threat', field: 'threat', show: false },
				{ id: 23, name: 'Creativity', field: 'creativity', show: false },
				{ id: 24, name: 'Influence', field: 'influence', show: false },
				{ id: 25, name: 'Bonus', field: 'bonus', show: false },
				{ id: 26, name: 'BPS', field: 'bps', show: false },
				{ id: 27, name: 'Goals', field: 'goals_scored', show: false },
				{ id: 28, name: 'Assists', field: 'assists', show: false },
				{ id: 29, name: 'CS', field: 'clean_sheets', show: false },
				{ id: 30, name: 'Saves', field: 'saves', show: false },
				{ id: 31, name: 'Conceded', field: 'goals_conceded', show: false },
				{ id: 32, name: 'Yellow Cards', field: 'yellow_cards', show: false },
				{ id: 33, name: 'Red Cards', field: 'red_cards', show: false },
			];
		}

		$scope.filter = function() {
			let filtered = [];

			$scope.data.elements.forEach(player => {
				let s = $scope.search,
					include = true;
				player.creativity = parseFloat(player.creativity);
				player.form = parseFloat(player.form);
				player.ict_index = parseFloat(player.ict_index);
				player.influence = parseFloat(player.influence);
				player.points_per_game = parseFloat(player.points_per_game);
				player.selected_by_percent = parseFloat(player.selected_by_percent);
				player.threat = parseFloat(player.threat);
				player.value_form = parseFloat(player.value_form);
				player.value_season = parseFloat(player.value_season);
				player.value_added_per_mil = (player.points_per_game - 2) / (player.now_cost / 10);

				if(s.name &&
					player.web_name.toLowerCase().indexOf(s.name.toLowerCase()) === -1)
					include = false;

				if(!s.teams.all && !s.teams[player.team])
					include = false;

				if(!s.poss.all && !s.poss[player.element_type])
					include = false;

				if(!between(player.total_points, s.totalPtsLow, s.totalPtsHigh))
					include = false;

				if(!between(player.form, s.formLow, s.formHigh))
					include = false;

				if(!between(player.now_cost / 10, s.priceLow, s.priceHigh))
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
				$('#loading').hide();
				$scope.data = data;
				$scope.filteredPlayers = data.elements;
				$scope.$digest();
				$scope.filter();
				$scope.$digest();
			},
			error: console.log
		});
	}]);
