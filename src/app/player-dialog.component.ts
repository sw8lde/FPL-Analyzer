import { Component, Inject } from '@angular/core';
import { MD_DIALOG_DATA } from '@angular/material';
import { FplService } from './fpl.service';
import { IPlayer } from './player';

@Component({
  selector: 'player-dialog',
  styleUrls: [ './player-dialog.component.css' ],
  templateUrl: './player-dialog.component.html'
})
export class PlayerDialog {
  constructor(@Inject(MD_DIALOG_DATA) public player: IPlayer) {}
}
