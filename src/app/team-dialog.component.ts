import { Component, Inject } from '@angular/core';
import { MD_DIALOG_DATA } from '@angular/material';
import { FplService } from './fpl.service';

@Component({
  selector: 'team-dialog',
  styleUrls: [
    './team-dialog.component.css',
		'./fpl-expandable-menu.directive.css'
  ],
  templateUrl: './team-dialog.component.html'
})
export class TeamDialogComponent {
  teams: any;
  index: number;

  constructor(@Inject(MD_DIALOG_DATA) public data: any, private fplService: FplService) {
    this.teams = data.teams;
    this.index = data.index;
  }

  getEventColor(diff: number): string {
    return this.fplService.getEventColor(diff);
  }
}
