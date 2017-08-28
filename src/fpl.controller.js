(function() {
	'use strict';

	angular
		.module('FPLAnalyzer')
		.controller('FPLCtrl', FPLCtrl);

	FPLCtrl.$inject = ['$scope'];

	function FPLCtrl($scope) {
		var fpl = this;

		/* vairables */
		fpl.cols;
		fpl.data;
		fpl.filteredPlayers;
		fpl.filters;
		fpl.popupPlayer;
		fpl.search;

		/* funcitons */
		fpl.exportData = exportData;
		fpl.filter = filter;
		fpl.resetTable = resetTable;
		fpl.showPopup = showPopup;
		fpl.toggleSort = toggleSort;
		fpl.updatePlayers = updatePlayers;

		resetTable();

		get('https://fantasy.premierleague.com/drf/bootstrap-static', data => {
			fpl.data = data;
			fpl.filteredPlayers = data.elements;
			updatePlayers();
			$scope.$digest();
		});

		function exportData() {
			const fileName = `FPL Player data ${ formatDate(Date.now()) }.csv`;
			let rows = [[]],
			labels = fpl.stats.labels;
			for(let id in labels) {
				if(labels.hasOwnProperty(id)) {
					rows.push([]);
				}
			}

			exportToCSV(fileName, rows);
		}

		function filter() {
			console.log('filtering')
			let filtered = [];

			if(!fpl.data) return;

			fpl.data.elements.forEach(player => {
				let s = fpl.search,
					include = true;

				if(s.name &&
					player.web_name.toLowerCase().indexOf(s.name.toLowerCase()) === -1)
					include = false;

				if(!s.teams.all && !s.teams[player.team])
					include = false;

				if(!s.poss.all && !s.poss[player.element_type])
					include = false;

				fpl.filters.some(filter => {
					if(filter.show && !between(player[filter.field], filter.low, filter.high)) {
						include = false;
						return true;
					}
					return false;
				});

				if(include) filtered.push(player);
			});

			fpl.filteredPlayers = filtered;
		}

		function resetTable() {
			fpl.cols = [
				// initialize to false so watchers go away
				{ id: 0, label: 'Name', field: 'web_name', show: true, full_label: false },
				{ id: 1, label: 'Team', field: 'team', show: true, full_label: false },
				{ id: 2, label: 'Pos', field: 'element_type', show: true, full_label: false },
				{ id: 3, label: 'Total Points', field: 'total_points', show: true, full_label: false },
				{ id: 4, label: 'GW Points', field: 'event_points', show: true, full_label: false },
				{ id: 5, label: 'PPG', field: 'points_per_game', show: false, full_label: 'Points Per Game' },
				{ id: 6, label: 'PPM', field: 'value_season', show: false, full_label: 'Points Per Million' },
				{ id: 7, label: 'Form', field: 'form', show: true, full_label: false },
				{ id: 8, label: 'FPM', field: 'value_form', show: false, full_label: 'Form Per Million' },
				{ id: 9, label: 'Price', field: 'now_cost', show: true, full_label: false },
				{ id: 10, label: 'VAPM', field: 'value_added_per_mil', show: true, full_label: 'Value Added Per Million' },
				{ id: 11, label: 'Minutes', field: 'minutes', show: true, full_label: false },
				{ id: 12, label: 'Transfers In', field: 'transfers_in', show: false, full_label: false },
				{ id: 13, label: 'Transfers Out', field: 'transfers_out', show: false, full_label: false },
				{ id: 14, label: 'Net Transfers', field: 'transfers_diff', show: false, full_label: false },
				{ id: 15, label: 'Transfers In (GW)', field: 'transfers_in_event', show: false, full_label: false },
				{ id: 16, label: 'Transfers out (GW)', field: 'transfers_out_event', show: false, full_label: false },
				{ id: 17, label: 'Net Transfers (GW)', field: 'transfers_diff_event', show: false, full_label: false },
				{ id: 18, label: 'Selected By', field: 'selected_by_percent', show: true, full_label: false },
				{ id: 19, label: 'Cost Change', field: 'cost_change_start', show: true, full_label: false },
				{ id: 20, label: 'Cost Change (GW)', field: 'cost_change_event', show: true, full_label: false },
				{ id: 21, label: 'ICT', field: 'ict_index', show: false, full_label: false },
				{ id: 22, label: 'Threat', field: 'threat', show: false, full_label: false },
				{ id: 23, label: 'Creativity', field: 'creativity', show: false, full_label: false },
				{ id: 24, label: 'Influence', field: 'influence', show: false, full_label: false },
				{ id: 25, label: 'Bonus', field: 'bonus', show: false, full_label: false },
				{ id: 26, label: 'BPS', field: 'bps', show: false, full_label: false },
				{ id: 27, label: 'Goals', field: 'goals_scored', show: false, full_label: false },
				{ id: 28, label: 'Assists', field: 'assists', show: false, full_label: false },
				{ id: 29, label: 'CS', field: 'clean_sheets', show: false, full_label: 'Clean Sheets' },
				{ id: 30, label: 'Saves', field: 'saves', show: false, full_label: false },
				{ id: 31, label: 'Conceded', field: 'goals_conceded', show: false, full_label: false },
				{ id: 32, label: 'Yellow Cards', field: 'yellow_cards', show: false, full_label: false },
				{ id: 33, label: 'Red Cards', field: 'red_cards', show: false, full_label: false }
			];

			fpl.filters = [
				{ label: 'Total Points', field: 'total_points' },
				{ label: 'GW Points', field: 'event_points' },
				{ label: 'PPG', field: 'points_per_game' },
				{ label: 'PPM', field: 'value_season' },
				{ label: 'Form', field: 'form' },
				{ label: 'FPM', field: 'value_form' },
				{ label: 'Price', field: 'now_cost' },
				{ label: 'VAPM', field: 'value_added_per_mil' },
				{ label: 'Minutes', field: 'minutes' },
				{ label: 'Transfers In', field: 'transfers_in' },
				{ label: 'Transfers Out', field: 'transfers_out' },
				{ label: 'Net Transfers', field: 'transfers_diff' },
				{ label: 'Transfers In (GW)', field: 'transfers_in_event' },
				{ label: 'Transfers out (GW)', field: 'transfers_out_event' },
				{ label: 'Net Transfers (GW)', field: 'transfers_diff_event' },
				{ label: 'Selected By', field: 'selected_by_percent' },
				{ label: 'Cost Change', field: 'cost_change_start' },
				{ label: 'Cost Change (GW)', field: 'cost_change_event' },
				{ label: 'ICT', field: 'ict_index' },
				{ label: 'Threat', field: 'threat' },
				{ label: 'Creativity', field: 'creativity' },
				{ label: 'Influence', field: 'influence' },
				{ label: 'Bonus', field: 'bonus' },
				{ label: 'BPS', field: 'bps' },
				{ label: 'Goals', field: 'goals_scored' },
				{ label: 'Assists', field: 'assists' },
				{ label: 'CS', field: 'clean_sheets' },
				{ label: 'Saves', field: 'saves' },
				{ label: 'Conceded', field: 'goals_conceded' },
				{ label: 'Yellow Cards', field: 'yellow_cards' },
				{ label: 'Red Cards', field: 'red_cards' }
			];

			fpl.search = {
				limit: true,
				limitSize: 50,
				sort: 'total_points',
				reverse: true,
				teams: { all: true },
				poss: { all: true }
			};
		}

		function showPopup(player) {
			fpl.popupPlayer = player;
			fpl.popupPlayer.url =
				'https://platform-static-files.s3.amazonaws.com/' +
				'premierleague/photos/players/110x140/p' +
				player.photo.slice(0, -4) + '.png';
			// $.ajax({
			// 	type: 'GET',
			// 	url: 'https://json2jsonp.com/?url=https://fantasy.premierleague.com/drf/element-summary',
			// 	dataType: 'jsonp',
			// 	success: data => {
			// 		$('#loading').hide();
			// 		$scope.data = data;
			// 		$scope.filteredPlayers = data.elements;
			// 		$scope.updatePlayers();
			// 		$scope.$digest();
			// 	},
			// 	error: console.log
			// });
			$('#blur').fadeIn(200);
		}

		function toggleSort(col) {
			if(col.field === fpl.search.sort) {
				fpl.search.reverse = !fpl.search.reverse;
			} else {
				fpl.search.sort = col.field;
				fpl.search.reverse = false;
			}
		}

		function updatePlayers() {
			fpl.data.elements.forEach(player => {
				player.now_cost = player.now_cost / 10;
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
	}
})();
