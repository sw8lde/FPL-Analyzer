import { Injectable } from '@angular/core';
import { IPlayer } from './player';

@Injectable()
export class PredictorService {
	playerItrCap: number = 100;
	posLen: number[] = [0, 2, 5, 5, 3];
	posSum: number[] = [0, 0, 2, 7, 12];
	restarts: number = 10;
	teamItr: number = 10000;

	getInitialTeam(players: any, budget: any): any {
			let team = {
				itb: budget,
				players: [],
				score: 0,
				total_points: 0
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

	getMoveProb(itr: number): number {
		return 0;
	}

	getPredictedTeam(players: any, budget: any): any {
		let team;

		if(typeof budget == 'number')
			team = this.getInitialTeam(players, budget);
		else
			team = this.getInitialTeam(players, budget.map(b => { return b; }));

		for(let itr = 0; itr < this.teamItr; itr++) {
			let succ;
			if(typeof budget == 'number') {
				succ = {
					itb: team.itb,
					players: team.players.map(player => { return player; }),
					score: team.score,
					total_points: 0
				}
			} else {
				succ = {
					itb: team.itb.map(itb => { return itb; }),
					players: team.players.map(player => { return player; }),
					score: team.score,
					total_points: 0
				}
			}

			if(typeof budget == 'number')
				this.getSuccessorByTotal(players, succ);
			else
				this.getSuccessorByPos(players, succ);

			if(succ.score > team.score)
				team = succ;

			if(typeof budget == 'number')
				team.itb = Math.round(team.itb * 10) / 10;
			else
				team.itb = team.itb.map(itb => { return Math.round(itb * 10) / 10; });
		}

		return team;
	}

	getScore(player: IPlayer): number {
		return (player.minutes)*player.form*(player.points_per_game - 2)/(player.now_cost - 3);
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

	predict(players: any, budget: any): any {
		let bestTeam = { score: 0 };

		for(let i = 0; i < this.restarts; i++) {
			let tempTeam = this.getPredictedTeam(players, budget);

			if(bestTeam.score < tempTeam.score)
				bestTeam = tempTeam;
		}

		return bestTeam;
	}

}
