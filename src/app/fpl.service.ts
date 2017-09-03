import { Injectable } from '@angular/core';
import { IPlayer } from './player';
import { Jsonp } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class FplService {
  constructor(private _jsonp: Jsonp) {}

  getData(cb: (value: any) => void): void {
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
}
