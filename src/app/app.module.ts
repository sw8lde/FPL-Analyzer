import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FplExpandableMenuDirective } from './fpl-expandable-menu.directive';
import { FplService } from './fpl.service';
import { FormsModule } from '@angular/forms';
import { JsonpModule } from '@angular/http';
import {
  MdButtonModule,
  MdCheckboxModule,
  MdDialogModule,
  MdExpansionModule,
  MdMenuModule,
  MdInputModule,
  MdRippleModule,
  MdSelectModule,
  MdSliderModule,
  MdTabsModule,
  MdToolbarModule,
  MdTooltipModule
} from '@angular/material';
import { NgModule } from '@angular/core';
import { PlayerDialogComponent } from './player-dialog.component';
import 'hammerjs';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent,
    FplExpandableMenuDirective,
    PlayerDialogComponent
  ],
  entryComponents: [
    PlayerDialogComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    JsonpModule,
    MdButtonModule,
    MdCheckboxModule,
    MdDialogModule,
    MdExpansionModule,
    MdMenuModule,
    MdInputModule,
    MdRippleModule,
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
