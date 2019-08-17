import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FplExpandableMenuDirective } from './fpl-expandable-menu.directive';
import { FplNoClickDirective } from './fpl-no-click.directive';
import { FplService } from './fpl.service';
import { FormsModule } from '@angular/forms';
import { HttpClientJsonpModule, HttpClientModule } from '@angular/common/http';
import {
	MatButtonModule,
  MatCheckboxModule,
  MatDialogModule,
	MatIconModule,
  MatInputModule,
  MatMenuModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSliderModule,
  MatSnackBarModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule
} from '@angular/material';
import { NgModule } from '@angular/core';
import { PlayerDialogComponent } from './player-dialog.component';
import { PredictorService } from './predictor.service';
import { TeamDialogComponent } from './team-dialog.component';
import 'hammerjs';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent,
    FplExpandableMenuDirective,
    FplNoClickDirective,
    PlayerDialogComponent,
    TeamDialogComponent
  ],
  entryComponents: [
    PlayerDialogComponent,
    TeamDialogComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
		HttpClientJsonpModule,
    HttpClientModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule,
		MatIconModule,
    MatInputModule,
		MatMenuModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSliderModule,
    MatSnackBarModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule
  ],
	providers: [ FplService, PredictorService ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
