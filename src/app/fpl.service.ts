import { Injectable } from '@angular/core';
import { IPlayer } from './player';
import { HttpRequest, HttpClient } from '@angular/common/http';

@Injectable()
export class FplService {
  constructor(private http: HttpClient) {}

	createEventMap(generalData: any, events: any): void {
		events.forEach(event => {
			let teamA = generalData.teams[event.team_a - 1];
			teamA.events = teamA.events || [];
			teamA.strength_h = teamA.strength_a = teamA.strength;

			let teamH = generalData.teams[event.team_h - 1];
			teamH.events = teamH.events || [];
			teamH.strength_h = teamH.strength_a = teamH.strength;

			teamA.events[event.event] = {
				date: event.deadline_time_formatted,
				event: event.event,
        finished: event.finished,
				id: event.id,
				is_home: false,
				opponent: event.team_h,
        opponent_score: event.team_h_score,
        team_score: event.team_a_score
			};
			teamH.events[event.event] = {
				date: event.deadline_time_formatted,
				event: event.event,
        finished: event.finished,
				id: event.id,
				is_home: true,
				opponent: event.team_a,
        opponent_score: event.team_a_score,
        team_score: event.team_h_score
			};

			// update teams record, points, goal differential
			// only do home team so games aren't counted twice
			teamH.goals_for = teamH.goals_for || 0;
			teamH.goals_against = teamH.goals_against || 0;
			teamH.record = teamH.record || [0, 0, 0]; // [W, L, D]

			teamH.goals_for += event.team_h_score;
			teamH.goals_against += event.team_a_score;
			if(event.finished) {
				switch(true) {
					case event.team_h_score > event.team_a_score:
						teamH.record[0]++;
						break;
					case event.team_h_score < event.team_a_score:
						teamH.record[1]++;
						break;
					default:
						teamH.record[2]++;
						break;
				}
			}
	  });
	}

  getEventColor(diff: number): string {
    const colors = [
      '',
      '#388e3c',
      '#81c784',
      '#e0e0e0',
      '#e57373',
      '#d32f2f'
    ];

    return colors[Math.round(diff)];
  }

	getEventData(cb: (value: any) => void): void {
		this.http.jsonp('https://json2jsonp.com/?url=https://fantasy.premierleague.com/api/fixtures/', 'callback').subscribe(cb);
	}

	getGeneralData(cb: (value: any) => void): void {
    this.http.jsonp('https://json2jsonp.com/?url=https://fantasy.premierleague.com/api/bootstrap-static/', 'callback').subscribe(cb);
  }

	updatePlayers(players: any): IPlayer[] {
		return players.map(player => {
			player.now_cost = player.now_cost / 10;
			player.creativity = parseFloat(player.creativity);
			player.ep_this = parseFloat(player.ep_this);
			player.ep_next = parseFloat(player.ep_next);
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
