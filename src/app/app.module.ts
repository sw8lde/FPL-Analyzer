import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FplExpandableMenuDirective } from './fpl-expandable-menu.directive';
import { FplNoClickDirective } from './fpl-no-click.directive';
import { FplService } from './fpl.service';
import { FormsModule } from '@angular/forms';
import { JsonpModule } from '@angular/http';
import {
  MdButtonModule,
  MdCheckboxModule,
  MdDialogModule,
  MdMenuModule,
  MdInputModule,
  MdProgressSpinnerModule,
  MdRadioModule,
  MdRippleModule,
  MdSnackBarModule,
  MdSelectModule,
  MdSliderModule,
  MdTabsModule,
  MdToolbarModule,
  MdTooltipModule
} from '@angular/material';
import { NgModule } from '@angular/core';
import { PlayerDialogComponent } from './player-dialog.component';
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
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    JsonpModule,
    MdButtonModule,
    MdCheckboxModule,
    MdDialogModule,
    MdMenuModule,
    MdInputModule,
    MdProgressSpinnerModule,
    MdRadioModule,
    MdRippleModule,
    MdSnackBarModule,
    MdSelectModule,
    MdSliderModule,
    MdTabsModule,
    MdToolbarModule,
    MdTooltipModule
  ],
	providers: [ FplService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
