import { Component, OnInit } from '@angular/core';
import { FplService } from './fpl.service';
import { IPlayer } from './player';
import { MdDialog, MdSnackBar } from '@angular/material';
import { PlayerDialogComponent } from './player-dialog.component';
import { PredictorService } from './predictor.service';
import { TeamDialogComponent } from './team-dialog.component';

export interface ICol {
	index: number;
	label?: string;
	label_icon?: string;
	label_full?: string;
	field: string;
  show?: boolean;
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
	styleUrls: [
		'./app.component.css',
		'./fpl-expandable-menu.directive.css'
	],
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
	cols: ICol[];
	filteredPlayers: any[];
	filters: IFilter[];
	generalData: any;
	op_events: any;
	op_predictor: any;
	op_players: any;
	pageSizes: any = [10, 25, 50, 100];
	tabIndex: number;

	constructor(private fplService: FplService,
		public dialog: MdDialog,
		public snackBar: MdSnackBar,
		public predictorService: PredictorService) {
		this.filteredPlayers = [];
		this.generalData = {};
		this.tabIndex = 0;
		this.op_events = { event_num: 5 }
		this.op_predictor = {
			budget_mode: 'total',
			budget_total: 100,
			budget_pos: [0, 10, 25, 35, 30],
			team: {
				event_points: 0,
				form: 0,
				itb: 0,
				players: [],
				score: 0,
				total_points: 0
			},
			weights: [0, 1, 1, 1, 1]
		}

		let genData = new Promise(resolve => {
			fplService.getGeneralData((res: any): void => {
				this.generalData = res;
				this.filteredPlayers = fplService.updatePlayers(res.elements);
				this.filterPlayers();
				resolve(this.generalData);
			});
		});

		fplService.getEventData((res: any): void => {
			genData.then(data => {
				fplService.createEventMap(data, res);
				this.updateEvents();
				// this.predict();
			});
		});
  }

  ngOnInit() {
		this.resetPlayersTable();
	}

	between(num: number, low: number, high: number): boolean {
		if(low !==0) low = low || -Infinity;
		if(high !==0) high = high || Infinity;
		return (num >= low) && ((high >= low && num <= high) || high < low);
	}

	downloadFile(name: string, contents: string, type: string) {
		let blob = new Blob([contents], {type: type});
		if(navigator.msSaveBlob) {
			navigator.msSaveBlob(blob, name);
		} else {
			let link = document.createElement("a");
			if(link.download !== undefined) {
				link.setAttribute("href", URL.createObjectURL(blob));
				link.setAttribute("download", name);
				link.style.visibility = 'hidden';
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
			}
		}
	}

	exportAll(): void {
		const d = new Date();
		const fileName = 'FPL player stats ' +
			`${d.getDay()}/${d.getDate()}/${d.getFullYear()}.csv`;
		let rows = [];

		rows.push(this.cols.map(col => {
			return col.label;
		}));

		this.generalData.elements.forEach(player => {
			rows.push(this.cols.map(col => {
				return player[col.field];
			}));
		});

		this.exportToCSV(rows, fileName);
	}

	exportFiltered(): void {
		const d = new Date();
		const fileName = 'FPL player stats (filtered) ' +
			`${d.getDay()}/${d.getDate()}/${d.getFullYear()}.csv`;
		let rows = [[]];

		this.cols.forEach(col => {
			if(col.show) rows[0].push(col.label);
		});

		this.filteredPlayers.forEach((player) => {
			rows.push([]);
			this.cols.forEach(col => {
				if(col.show) rows[rows.length - 1].push(player[col.field]);
			});
		});

		this.exportToCSV(rows, fileName);
	}

	exportRaw(): void {
		this.downloadFile('FPL raw data.json',
			JSON.stringify(this.generalData),
			'text/json;charset=utf-8;')
	}

	exportToCSV(rows: string[][], fileName: string): void {
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

		this.downloadFile(fileName, csvFile, 'text/csv;charset=utf-8;');
	}

	filterPlayers(): void {
		let filtered = [];

		if(!this.generalData || !this.generalData.elements) return;
		this.generalData.elements.forEach(player => {
			const s = this.op_players;
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
			let propA = a[this.op_players.sort];
			let propB = b[this.op_players.sort];

			let valueA = isNaN(+propA) ? propA : +propA;
			let valueB = isNaN(+propB) ? propB : +propB;

			return (valueA < valueB ? -1 : 1) * (this.op_players.reverse ? -1 : 1);
		});
	}

	getEventColor(diff: number): string {
		if(!this.op_events.show_event_colors) return 'none';
		return this.fplService.getEventColor(diff);
	}

	getPages(): number {
		return Math.ceil(this.filteredPlayers.length / this.op_players.pageSize);
	}

	getTeamEventProd(team: any): string {
		return Math.pow(team.event_prod, 1 / this.op_events.event_num).toFixed(2);
	}

	loadTeamStrength(): void {
		let diff = JSON.parse(localStorage.getItem('teamStrength'));

		if(diff) {
			diff.forEach((team, index) => {
				this.generalData.teams[index].strength_a = team.a;
				this.generalData.teams[index].strength_h = team.h;
			});
		}
	}

	predict(): void {
		this.op_predictor.team.players = [];

		if(this.op_predictor.budget_mode == 'total') {
			this.op_predictor.team = this.predictorService.predict(
				this.generalData.elements,
				this.op_predictor.budget_total,
				this.op_predictor.weights);
		} else {
			this.op_predictor.team = this.predictorService.predict(
				this.generalData.elements,
				this.op_predictor.budget_pos,
				this.op_predictor.weights);
		}

		// update itb if its by position
		if(typeof this.op_predictor.team.itb == 'object') {
			this.op_predictor.team.itb =
				'GKP: £' + this.op_predictor.team.itb[1] + ', ' +
				'DEF: £' + this.op_predictor.team.itb[2] + ', ' +
				'MID: £' + this.op_predictor.team.itb[3] + ', ' +
				'FWD: £' + this.op_predictor.team.itb[4]
		}

		this.op_predictor.team.players.forEach(player => {
			player.url = 'https://platform-static-files.s3.amazonaws.com/' +
				'premierleague/photos/players/110x140/p' +
				player.photo.slice(0, -4) + '.png';

			this.op_predictor.team.total_points += player.total_points;
			this.op_predictor.team.event_points += player.event_points;
			this.op_predictor.team.form += player.form;
		});

		// sort by position and price
		this.op_predictor.team.players.sort((a, b) => {
			return (a.element_type  + .1 - (a.now_cost / 100)) - (b.element_type  + .1 - (b.now_cost / 100));
		});
	}

	resetPlayersTable(): void {
    this.cols = [
			{ index: 0, label: 'Player', field: 'web_name', show: true },
			{ index: 1, label: 'Team', field: 'team', show: true },
			{ index: 2, label: 'Pos', field: 'element_type', show: true },
			{ index: 3, label: 'P', label_full: 'Total Points', field: 'total_points', show: true },
			{ index: 4, label: 'P (GW)', label_full: 'Gameweek Points', field: 'event_points' },
			{ index: 5, label: 'PPG', label_full: 'Points Per Game', field: 'points_per_game' },
			{ index: 6, label: 'PPM', label_full: 'Points Per Million', field: 'value_season' },
			{ index: 7, label: 'F', label_full: 'Form', field: 'form', show: true },
			{ index: 8, label: 'FPM', label_full: 'Form Per Million', field: 'value_form' },
			{ index: 9, label: '£', label_full: 'Price', field: 'now_cost', show: true },
			{ index: 10, label: 'VAPM', label_full: 'Value Added Per Million', field: 'value_added_per_mil', show: true },
			{ index: 11, label: 'MP', label_full: 'Minutes Played', field: 'minutes' },
			{ index: 12, label_icon: 'arrow_back', label_full: 'Transfers In', field: 'transfers_in' },
			{ index: 13, label_icon: 'arrow_forward', label_full: 'Transfers Out', field: 'transfers_out' },
			{ index: 14, label_icon: 'swap_horiz', label_full: 'Net Transfers', field: 'transfers_diff', show: true },
			{ index: 15, label_icon: 'arrow_back', label: '(GW)', label_full: 'Gameweek Transfers In', field: 'transfers_in_event' },
			{ index: 16, label_icon: 'arrow_forward', label: '(GW)', label_full: 'Gameweek Transfers Out', field: 'transfers_out_event' },
			{ index: 17, label_icon: 'swap_horiz', label: '(GW)', label_full: 'Gameweek Net Transfers', field: 'transfers_diff_event', show: true },
			{ index: 18, label: '%', label_full: 'Selected By Percent', field: 'selected_by_percent', show: true },
			{ index: 19, label_icon: 'trending_up', label_full: 'Price Change', field: 'cost_change_start', show: true },
			{ index: 20, label_icon: 'trending_up', label: '(GW)', label_full: 'Gameweek Price Change', field: 'cost_change_event' },
			{ index: 21, label: 'ICT', field: 'ict_index' },
			{ index: 22, label: 'Threat', field: 'threat' },
			{ index: 23, label: 'Creativity', field: 'creativity' },
			{ index: 24, label: 'Influence', field: 'influence' },
			{ index: 25, label: 'Bonus', field: 'bonus' },
			{ index: 26, label: 'BPS', field: 'bps' },
			{ index: 27, label: 'Goals', field: 'goals_scored' },
			{ index: 28, label: 'Assists', field: 'assists' },
			{ index: 29, label: 'CS', label_full: 'Clean Sheets', field: 'clean_sheets' },
			{ index: 30, label: 'Saves', field: 'saves' },
			{ index: 31, label: 'Conceded', field: 'goals_conceded' },
			{ index: 32, label: 'Yellow Cards', field: 'yellow_cards' },
			{ index: 33, label: 'Red Cards', field: 'red_cards' }
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

		this.op_players = {
			page: 1,
			pageSize: this.pageSizes[1],
			poss: { all: true },
			reverse: true,
			sort: 'total_points',
			teams: { all: true },
		};
  }

	resetTeamStrength(): void {
		this.generalData.teams.forEach(team => {
			team.strength_a = team.strength;
			team.strength_h = team.strength;
		});
	}

	saveTeamStrength(): void {
		let diff = [];

		this.generalData.teams.forEach((team, index) => {
			diff[index] = {
				a: team.strength_a,
				h: team.strength_h
			}
		});

		localStorage.setItem('teamStrength', JSON.stringify(diff));
		this.snackBar.open('Saved!', null, { duration: 2000 });
	}

	showPopupPlayer(player: IPlayer): void {
		player.team_name = this.generalData.teams[player.team - 1].name;
		player.pos_name = this.generalData.element_types[player.element_type - 1].singular_name;
		player.url = 'https://platform-static-files.s3.amazonaws.com/' +
			'premierleague/photos/players/110x140/p' +
			player.photo.slice(0, -4) + '.png';

	  this.dialog.open(PlayerDialogComponent, {
	    data: { player: player, teams: this.generalData.teams }
	  });
	}

	showPopupTeam(teams: any, index: number): void {
		this.dialog.open(TeamDialogComponent, {
	    data: { teams: teams, index: index }
	  });
	}

	togglePlayersSort(col: ICol): void {
		if(col.field === this.op_players.sort) {
			this.op_players.reverse = !this.op_players.reverse;
			this.filteredPlayers.sort((a, b) => {
	      let propA = a[this.op_players.sort];
	      let propB = b[this.op_players.sort];

	      let valueA = isNaN(+propA) ? propA : +propA;
	      let valueB = isNaN(+propB) ? propB : +propB;

	      return (valueA < valueB ? -1 : 1) * (this.op_players.reverse ? -1 : 1);
	    });
		} else {
			this.op_players.sort = col.field;
			this.op_players.reverse = false;
			this.filteredPlayers.sort((a, b) => {
	      let propA = a[this.op_players.sort];
	      let propB = b[this.op_players.sort];

	      let valueA = isNaN(+propA) ? propA : +propA;
	      let valueB = isNaN(+propB) ? propB : +propB;

	      return valueA < valueB ? -1 : 1;
	    });
		}
	}

	updateEvents(): void {
		const nextEvent = this.generalData['current-event'] + 1;

		this.generalData.teams.forEach(team => {
			let sum = 0,
					prod = 1;

			for(let i = nextEvent; i < nextEvent + this.op_events.event_num
				&& i < team.events.length; i++) {
				if(team.events[i]) {
					const opponent = this.generalData.teams[team.events[i].opponent - 1];
					if(team.events[i].is_home) {
						sum += opponent.strength_a;
						prod *= opponent.strength_a;
					} else {
						sum += opponent.strength_h;
						prod *= opponent.strength_h;
					}
				}
			}

			team.event_sum = sum;
			team.event_prod = prod;
		});
	}
}
