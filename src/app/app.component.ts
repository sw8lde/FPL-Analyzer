import { Component, OnInit, ViewChild } from '@angular/core';
import { FplService } from './fpl.service';
import { IPlayer } from './player';

export interface ICol {
	index: number;
	label: string;
	field: string;
  show?: boolean;
	full_label?: string;
}

export interface IFilter {
	field: string;
	label: string;
	show?: boolean;
	low?: number;
	high?: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ],
	providers: [ FplService ]
})
export class AppComponent implements OnInit {
	cols: ICol[];
	data: any;
	filteredPlayers: any[];
	filters: IFilter[];
	search: any;

	constructor(fplService: FplService) {
		this.data = {};
		this.filteredPlayers = [];
    fplService.getData((res: any): void => {
			this.data = res;
			this.filteredPlayers = fplService.updatePlayers(res.elements);
			this.filter();
		});
  }

  ngOnInit() {
		this.resetTable();
	}

	between(num: number, low: number, high: number): boolean {
		if(low !==0) low = low || -Infinity;
		if(high !==0) high = high || Infinity;
		return (num >= low) && ((high >= low && num <= high) || high < low);
	}

	exportToCSV(): void {
		const d = new Date();
		const fileName = 'FPL player stats ' +
			`${d.getDay()}/${d.getDate()}/${d.getFullYear()}.csv`;
		let rows = [];

		rows.push(this.cols.map(col => {
			return col.label;
		}));

		this.data.elements.forEach(player => {
			rows.push(this.cols.map(col => {
				return player[col.field];
			}));
		});

		let processRow = function(row) {
			let finalVal = '';
			for(let j = 0; j < row.length; j++) {
				let innerValue = row[j] == undefined ? '' : row[j].toString();
				if(row[j] instanceof Date) {
					innerValue = row[j].toLocaleString();
				};
				let result = innerValue.replace(/"/g, '""');
				if(result.search(/("|,|\n)/g) >= 0)
				result = '"' + result + '"';
				if(j > 0)
				finalVal += ',';
				finalVal += result;
			}
			return finalVal + '\n';
		};

		let csvFile = '';
		for(let i = 0; i < rows.length; i++) {
			csvFile += processRow(rows[i]);
		}

		let blob = new Blob([csvFile], {type: 'text/csv;charset=utf-8;'});
		if(navigator.msSaveBlob) {
			navigator.msSaveBlob(blob, fileName);
		} else {
			let link = document.createElement("a");
			if(link.download !== undefined) {
				link.setAttribute("href", URL.createObjectURL(blob));
				link.setAttribute("download", fileName);
				link.style.visibility = 'hidden';
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
			}
		}
	}

	filter(): void {
		let filtered = [];

		if(!this.data || !this.data.elements) return;
		this.data.elements.forEach(player => {
			const s = this.search;
			let include = true;

			if(s.name &&
				player.web_name.toLowerCase().indexOf(s.name.toLowerCase()) === -1)
				include = false;

			if(!s.teams.all && !s.teams[player.team])
				include = false;

			if(!s.poss.all && !s.poss[player.element_type])
				include = false;

			this.filters.some(filter => {
				if(filter.show && !this.between(player[filter.field], filter.low, filter.high)) {
					include = false;
					return true;
				}
				return false;
			});

			if(include) filtered.push(player);
		});

		this.filteredPlayers = filtered.sort((a, b) => {
			let propA = a[this.search.sort];
			let propB = b[this.search.sort];

			let valueA = isNaN(+propA) ? propA : +propA;
			let valueB = isNaN(+propB) ? propB : +propB;

			return (valueA < valueB ? -1 : 1) * (this.search.reverse ? -1 : 1);
		});
	}

	resetTable(): void {
    this.cols = [
			{ index: 0, label: 'Name', field: 'web_name', show: true },
			{ index: 1, label: 'Team', field: 'team', show: true },
			{ index: 2, label: 'Pos', field: 'element_type', show: true },
			{ index: 3, label: 'Total Points', field: 'total_points', show: true },
			{ index: 4, label: 'GW Points', field: 'event_points', show: true },
			{ index: 5, label: 'PPG', field: 'points_per_game', full_label: 'Points Per Game' },
			{ index: 6, label: 'PPM', field: 'value_season', full_label: 'Points Per Million' },
			{ index: 7, label: 'Form', field: 'form', show: true },
			{ index: 8, label: 'FPM', field: 'value_form', full_label: 'Form Per Million' },
			{ index: 9, label: 'Price', field: 'now_cost', show: true },
			{ index: 10, label: 'VAPM', field: 'value_added_per_mil', full_label: 'Value Added Per Million', show: true },
			{ index: 11, label: 'Minutes', field: 'minutes' },
			{ index: 12, label: 'Transfers In', field: 'transfers_in' },
			{ index: 13, label: 'Transfers Out', field: 'transfers_out' },
			{ index: 14, label: 'Net Transfers', field: 'transfers_diff', show: true },
			{ index: 15, label: 'Transfers In (GW)', field: 'transfers_in_event' },
			{ index: 16, label: 'Transfers out (GW)', field: 'transfers_out_event' },
			{ index: 17, label: 'Net Transfers (GW)', field: 'transfers_diff_event', show: true },
			{ index: 18, label: 'Selected By', field: 'selected_by_percent', show: true },
			{ index: 19, label: 'Cost Change', field: 'cost_change_start', show: true },
			{ index: 20, label: 'Cost Change (GW)', field: 'cost_change_event', show: true },
			{ index: 21, label: 'ICT', field: 'ict_index', },
			{ index: 22, label: 'Threat', field: 'threat', },
			{ index: 23, label: 'Creativity', field: 'creativity', },
			{ index: 24, label: 'Influence', field: 'influence', },
			{ index: 25, label: 'Bonus', field: 'bonus', },
			{ index: 26, label: 'BPS', field: 'bps', },
			{ index: 27, label: 'Goals', field: 'goals_scored', },
			{ index: 28, label: 'Assists', field: 'assists', },
			{ index: 29, label: 'CS', field: 'clean_sheets', full_label: 'Clean Sheets' },
			{ index: 30, label: 'Saves', field: 'saves', },
			{ index: 31, label: 'Conceded', field: 'goals_conceded', },
			{ index: 32, label: 'Yellow Cards', field: 'yellow_cards', },
			{ index: 33, label: 'Red Cards', field: 'red_cards', }
		];

		this.filters = [
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

		this.search = {
			showCols: [
				'web_name',
				'team',
				'element_type',
				'total_points',
				'event_points',
				'form',
				'now_cost',
				'value_added_per_mil',
				'transfers_diff',
				'transfers_diff_event',
				'selected_by_percent',
				'cost_change_start',
				'cost_change_event'
			],
			showFilters: [],
			showPoss: ['All'],
			showTeams: ['All'],
			limit: true,
			limitSize: 50,
			reverse: true,
			poss: { all: true },
			sort: 'total_points',
			teams: { all: true },
		};
  }

	toggleSort(col: ICol): void {
		if(col.field === this.search.sort) {
			this.search.reverse = !this.search.reverse;
			this.filteredPlayers.sort((a, b) => {
	      let propA = a[this.search.sort];
	      let propB = b[this.search.sort];

	      let valueA = isNaN(+propA) ? propA : +propA;
	      let valueB = isNaN(+propB) ? propB : +propB;

	      return (valueA < valueB ? -1 : 1) * (this.search.reverse ? -1 : 1);
	    });
		} else {
			this.search.sort = col.field;
			this.search.reverse = false;
			this.filteredPlayers.sort((a, b) => {
	      let propA = a[this.search.sort];
	      let propB = b[this.search.sort];

	      let valueA = isNaN(+propA) ? propA : +propA;
	      let valueB = isNaN(+propB) ? propB : +propB;

	      return valueA < valueB ? -1 : 1;
	    });
		}
	}
}
