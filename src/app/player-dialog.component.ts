import { Component, Inject } from '@angular/core';
import { MD_DIALOG_DATA } from '@angular/material';
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

  constructor(@Inject(MD_DIALOG_DATA) public data: any) {
    this.player = data.player;
    this.teams = data.teams;
  }
}
