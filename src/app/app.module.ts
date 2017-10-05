import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FplFixedDirective } from './fpl-fixed.directive';
import { FplService } from './fpl.service';
import { FplSidenavDirective } from './fpl-sidenav.directive';
import { FplSidenavContainerDirective } from './fpl-sidenav-container.directive';
import { FormsModule } from '@angular/forms';
import { JsonpModule } from '@angular/http';
import {
  MdButtonModule,
  MdCheckboxModule,
  MdDialogModule,
  MdMenuModule,
  MdInputModule,
  MdSelectModule,
  MdSliderModule,
  MdToolbarModule,
  MdTooltipModule
} from '@angular/material';
import { NgModule } from '@angular/core';
import { PlayerDialogComponent } from './player-dialog.component';
import { WindowRefService } from './window-ref.service';
import 'hammerjs';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent,
    FplFixedDirective,
    FplSidenavDirective,
    FplSidenavContainerDirective,
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
    MdMenuModule,
    MdInputModule,
    MdSelectModule,
    MdSliderModule,
    MdToolbarModule,
    MdTooltipModule
  ],
	providers: [ FplService, WindowRefService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
