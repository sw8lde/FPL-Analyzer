import { Injectable } from '@angular/core';
import { IPlayer } from './player';
import { Jsonp } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class FplService {
  constructor(private _jsonp: Jsonp) {}

  getGeneralData(cb: (value: any) => void): void {
    this._jsonp.request('https://json2jsonp.com/?url=https://fantasy.premierleague.com/drf/bootstrap-static&callback=JSONP_CALLBACK')
      .map(res => res.json())
      .subscribe(
        cb,
        console.error);
  }

	updatePlayers(players: any): IPlayer[] {
		return players.map(player => {
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
			return player;
		});
	}

	getEventData(cb: (valy: any) => void): void {
    this._jsonp.request('https://json2jsonp.com/?url=https://fantasy.premierleague.com/drf/fixtures/&callback=JSONP_CALLBACK')
      .map(res => res.json())
      .subscribe(
        cb,
        console.error);
	}

	createEventMap(generalData: any, events: any): void {
		generalData.event_num = 5;

		events.forEach(event => {
			let teamA = generalData.teams[event.team_a - 1];
			let teamH = generalData.teams[event.team_h - 1];

			teamA.events = teamA.events || [];
			teamH.events = teamH.events || [];
			teamA.strength_h = teamA.strength_a = teamA.strength;
			teamH.strength_h = teamH.strength_a = teamH.strength;

			teamA.events[event.event] = {
				event: event.event,
				is_home: true,
				id: event.id,
				opponent: event.team_h
			};
			teamH.events[event.event] = {
				event: event.event,
				is_home: true,
				id: event.id,
				opponent: event.team_a
			};
	  });
	}
}
