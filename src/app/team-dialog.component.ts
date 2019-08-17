import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
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
	current_event: number;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private fplService: FplService) {
    this.teams = data.teams;
    this.index = data.index;
    this.current_event = data.current_event;
  }

  getEventColor(diff: number): string {
    return this.fplService.getEventColor(diff);
  }
}
