import { Injectable } from '@angular/core';
import { IPlayer } from './player';

@Injectable()
export class PredictorService {
	coolingRate: number = 0.9;
	playerItrCap: number = 500;
	posLen: number[] = [0, 2, 5, 5, 3];
	posSum: number[] = [0, 0, 2, 7, 12];
	restarts: number = 10;
	teamItr: number = 10000;
	temp: number = 80000;
	weights: number[] = [0, 1, 1, 1, 1];

	getInitialTeam(players: any, budget: any): any {
			let team = {
				itb: budget,
				players: [],
				score: 0
			};

			let currPos = 1;

			for(let i = 0; i < 15; i++) {
				if(i == 2 || i == 7 || i == 12)
					currPos++;

				let player;
				if(typeof budget == 'number') {
					while(!(player = players[Math.floor(Math.random() * players.length)])
						|| player.element_type != currPos || player.now_cost > team.itb / (15 - i));

					team.itb -= player.now_cost;
				} else {
					while(!(player = players[Math.floor(Math.random() * players.length)])
						|| player.element_type != currPos
						|| player.now_cost > team.itb[currPos] / (this.posLen[currPos] - i + this.posSum[currPos]));

					team.itb[currPos] -= player.now_cost;
				}

				team.players[i] = player;
				team.score += this.getScore(player);
			}

			return team;
	}

	getMoveProb(itr: number, bestScore: any, succScore: any): number {
		return Math.exp(-(bestScore - succScore)/(this.temp * Math.pow(this.coolingRate, itr)));
	}

	getPredictedTeam(players: any, budget: any): any {
		let team;

		if(typeof budget == 'number')
			team = this.getInitialTeam(players, budget);
		else
			team = this.getInitialTeam(players, budget.map(b => { return b; }));

		for(let itr = 0; itr < this.teamItr; itr++) {
			let succ = {
				itb: 0,
				players: team.players.map(player => { return player; }),
				score: team.score
			}

			if(typeof budget == 'number') {
				succ.itb = team.itb;
				this.getSuccessorByTotal(players, succ);
			} else {
				succ.itb = team.itb.map(itb => { return itb; });
				this.getSuccessorByPos(players, succ);
			}

			if(succ.score > team.score
				|| Math.random() < this.getMoveProb(itr, team.score, succ.score))
				team = succ;

			if(typeof budget == 'number')
				team.itb = Math.round(team.itb * 10) / 10;
			else
				team.itb = team.itb.map(itb => { return Math.round(itb * 10) / 10; });
		}

		return team;
	}

	getScore2(player: IPlayer): number {
		let score = player.form * (player.points_per_game - 2) * player.minutes / 90;

		switch(player.element_type) {
			case 1:
				score /= (Math.abs(player.now_cost - 3.5) + 1);
				score *= player.clean_sheets;
				break;
			case 2:
				score /= (Math.abs(player.now_cost - 3.5) + 1);
				score *= player.clean_sheets;
				break;
			case 3:
				score /= (Math.abs(player.now_cost - 4) + 1);
				score *= player.goals_scored + player.assists;
				break;
			case 4:
				score /= (Math.abs(player.now_cost - 4.5) + 1);
				score *= player.goals_scored + player.assists;
				break;
		}

		return this.weights[player.element_type]*score;
	}

	getScore(player: IPlayer): number {
		return player.ep_next;
	}

	getSuccessorByPos(players: any, team: any): void {
		let pos = Math.floor(Math.random() * 4 + 1);
		let index1 = Math.floor(Math.random() * this.posLen[pos]) + this.posSum[pos];
		let index2 = Math.floor(Math.random() * this.posLen[pos]) + this.posSum[pos];
		let newPlayer1, newPlayer2, i;

		// swap first player
		team.itb[pos] += team.players[index1].now_cost;
		team.score -= this.getScore(team.players[index1]);

		i = 0;
		while(!this.isValidPlayer(
			team,
			index1,
			newPlayer1 = players[Math.floor(Math.random() * players.length)]
		) && ++i < this.playerItrCap);

		if(i != this.playerItrCap) {
			team.players[index1] = newPlayer1;
		}
		team.itb[pos] -= team.players[index1].now_cost;
		team.score += this.getScore(team.players[index1]);

		// swap second player
		team.itb[pos] += team.players[index2].now_cost;
		team.score -= this.getScore(team.players[index2]);

		i = 0;
		while(!this.isValidPlayer(
			team,
			index2,
			newPlayer2 = players[Math.floor(Math.random() * players.length)]
		) && ++i < this.playerItrCap);

		if(i != this.playerItrCap) {
			team.players[index2] = newPlayer2;
		}
		team.itb[pos] -= team.players[index2].now_cost;
		team.score += this.getScore(team.players[index2]);
	}

	getSuccessorByTotal(players: any, team: any): void {
		let index1 = Math.floor(Math.random() * 15);
		let index2 = Math.floor(Math.random() * 15);
		let newPlayer1, newPlayer2, i;

		// swap first player
		team.itb += team.players[index1].now_cost;
		team.score -= this.getScore(team.players[index1]);

		i = 0;
		while(!this.isValidPlayer(
			team,
			index1,
			newPlayer1 = players[Math.floor(Math.random() * players.length)]
		) && ++i < this.playerItrCap);

		if(i != this.playerItrCap) {
			team.players[index1] = newPlayer1;
		}
		team.itb-= team.players[index1].now_cost;
		team.score += this.getScore(team.players[index1]);

		// swap second player
		team.itb += team.players[index2].now_cost;
		team.score -= this.getScore(team.players[index2]);

		i = 0;
		while(!this.isValidPlayer(
			team,
			index2,
			newPlayer2 = players[Math.floor(Math.random() * players.length)]
		) && ++i < this.playerItrCap);

		if(i != this.playerItrCap) {
			team.players[index2] = newPlayer2;
		}
		team.itb -= team.players[index2].now_cost;
		team.score += this.getScore(team.players[index2]);
	}

	isValidPlayer(team: any, oldIndex: number, newPlayer: IPlayer): boolean {
		if(team.players[oldIndex].element_type != newPlayer.element_type)
			return false;

		if(typeof team.itb == 'number'
			&& newPlayer.now_cost > team.itb)
			return false;

		if(typeof team.itb == 'object'
			&& newPlayer.now_cost > team.itb[newPlayer.element_type])
			return false;

		if(newPlayer.chance_of_playing_next_round != null
			&& newPlayer.chance_of_playing_next_round < 50)
			return false;

		// check for duplicates and max team members
		let teammates = 0;
		if(team.players.some(player => {
				if(player.team == newPlayer.team)
					teammates++;

				return player.id == newPlayer.id || teammates == 3;
			}))
			return false;

		return true;
	}

	predict(players: any, budget: any, weights: number[]): Promise<any> {
		return new Promise(resolve => {
			this.weights = weights;
			let bestTeam = { score: 0 };

			for(let i = 0; i < this.restarts; i++) {
				let succTeam = this.getPredictedTeam(players, budget);

				if(bestTeam.score < succTeam.score)
					bestTeam = succTeam;
			}

			resolve(bestTeam);
		});
	}

}
