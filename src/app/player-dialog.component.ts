import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { FplService } from './fpl.service';
import { IPlayer } from './player';

@Component({
  selector: 'player-dialog',
  styleUrls: [
    './player-dialog.component.css',
		'./fpl-expandable-menu.directive.css'
  ],
  templateUrl: './player-dialog.component.html'
})
export class PlayerDialogComponent {
  player: IPlayer;
  teams: any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private fplService: FplService) {
    this.player = data.player;
    this.teams = data.teams;
  }

  getEventColor(diff: number): string {
    return this.fplService.getEventColor(diff);
  }
}
