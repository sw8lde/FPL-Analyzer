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

			$scope.filters = [
				{label: 'Total Points', field: 'total_points'},
				{label: 'GW Points', field: 'event_points'},
				{label: 'PPG', field: 'points_per_game'},
				{label: 'PPM', field: 'value_season'},
				{label: 'Form', field: 'form'},
				{label: 'FPM', field: 'value_form'},
				{label: 'Price', field: 'now_cost'},
				{label: 'VAPM', field: 'value_added_per_mil'},
				{label: 'Minutes', field: 'minutes'},
				{label: 'Transfers In', field: 'transfers_in'},
				{label: 'Transfers Out', field: 'transfers_out'},
				{label: 'Net Transfers', field: 'transfers_diff'},
				{label: 'Transfers In (GW)', field: 'transfers_in_event'},
				{label: 'Transfers out (GW)', field: 'transfers_out_event'},
				{label: 'Net Transfers (GW)', field: 'transfers_diff_event'},
				{label: 'Selected By', field: 'selected_by_percent'},
				{label: 'Cost Change', field: 'cost_change_start'},
				{label: 'Cost Change (GW)', field: 'cost_change_event'},
				{label: 'ICT', field: 'ict_index'},
				{label: 'Threat', field: 'threat'},
				{label: 'Creativity', field: 'creativity'},
				{label: 'Influence', field: 'influence'},
				{label: 'Bonus', field: 'bonus'},
				{label: 'BPS', field: 'bps'},
				{label: 'Goals', field: 'goals_scored'},
				{label: 'Assists', field: 'assists'},
				{label: 'CS', field: 'clean_sheets'},
				{label: 'Saves', field: 'saves'},
				{label: 'Conceded', field: 'goals_conceded'},
				{label: 'Yellow Cards', field: 'yellow_cards'},
				{label: 'Red Cards', field: 'red_cards'},
			];

			$scope.cols = [
				{ id: 0, label: 'Name', field: 'web_name', show: true },
				{ id: 1, label: 'Team', field: 'team', show: true },
				{ id: 2, label: 'Pos', field: 'element_type', show: true },
				{ id: 3, label: 'Total Points', field: 'total_points', show: true },
				{ id: 4, label: 'GW Points', field: 'event_points', show: true },
				{ id: 5, label: 'PPG', field: 'points_per_game', show: false, full_label: 'Points Per Game' },
				{ id: 6, label: 'PPM', field: 'value_season', show: false, full_label: 'Points Per Million' },
				{ id: 7, label: 'Form', field: 'form', show: true },
				{ id: 8, label: 'FPM', field: 'value_form', show: false, full_label: 'Form Per Million' },
				{ id: 9, label: 'Price', field: 'now_cost', show: true },
				{ id: 10, label: 'VAPM', field: 'value_added_per_mil', show: true, full_label: 'Value Added Per Million' },
				{ id: 11, label: 'Minutes', field: 'minutes', show: true },
				{ id: 12, label: 'Transfers In', field: 'transfers_in', show: false },
				{ id: 13, label: 'Transfers Out', field: 'transfers_out', show: false },
				{ id: 14, label: 'Net Transfers', field: 'transfers_diff', show: false },
				{ id: 15, label: 'Transfers In (GW)', field: 'transfers_in_event', show: false },
				{ id: 16, label: 'Transfers out (GW)', field: 'transfers_out_event', show: false },
				{ id: 17, label: 'Net Transfers (GW)', field: 'transfers_diff_event', show: false },
				{ id: 18, label: 'Selected By', field: 'selected_by_percent', show: true },
				{ id: 19, label: 'Cost Change', field: 'cost_change_start', show: true },
				{ id: 20, label: 'Cost Change (GW)', field: 'cost_change_event', show: true },
				{ id: 21, label: 'ICT', field: 'ict_index', show: false },
				{ id: 22, label: 'Threat', field: 'threat', show: false },
				{ id: 23, label: 'Creativity', field: 'creativity', show: false },
				{ id: 24, label: 'Influence', field: 'influence', show: false },
				{ id: 25, label: 'Bonus', field: 'bonus', show: false },
				{ id: 26, label: 'BPS', field: 'bps', show: false },
				{ id: 27, label: 'Goals', field: 'goals_scored', show: false },
				{ id: 28, label: 'Assists', field: 'assists', show: false },
				{ id: 29, label: 'CS', field: 'clean_sheets', show: false, full_label: 'Clean Sheets' },
				{ id: 30, label: 'Saves', field: 'saves', show: false },
				{ id: 31, label: 'Conceded', field: 'goals_conceded', show: false },
				{ id: 32, label: 'Yellow Cards', field: 'yellow_cards', show: false },
				{ id: 33, label: 'Red Cards', field: 'red_cards', show: false },
			];
		}

		$scope.updatePlayers = function() {
			$scope.data.elements.forEach(player => {
				player.now_cost = parseFloat(player.now_cost / 10);
				player.creativity = parseFloat(player.creativity);
				player.form = parseFloat(player.form);
				player.ict_index = parseFloat(player.ict_index);
				player.influence = parseFloat(player.influence);
				player.points_per_game = parseFloat(player.points_per_game);
				player.selected_by_percent = parseFloat(player.selected_by_percent);
				player.threat = parseFloat(player.threat);
				player.value_form = parseFloat(player.value_form);
				player.value_season = parseFloat(player.value_season);
				player.value_added_per_mil = (player.points_per_game - 2) / (player.now_cost);
				player.transfers_diff = player.transfers_in - player.transfers_out;
				player.transfers_diff_event = player.transfers_in_event - player.transfers_out_event;
			});
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

				$scope.filters.some(filter => {
					if(filter.show && !between(player[filter.field], filter.low, filter.high)) {
						include = false;
						return true;
					}
					return false;
				});

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
				$scope.updatePlayers();
				$scope.$digest();
			},
			error: console.log
		});
	}]);
