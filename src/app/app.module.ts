import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FplFixedDirective } from './fpl-fixed.directive';
import { FplService } from './fpl.service';
import { FormsModule } from '@angular/forms';
import { JsonpModule } from '@angular/http';
import {
  MdButtonModule,
  MdCheckboxModule,
  MdInputModule,
  MdSelectModule,
  MdSidenavModule,
  MdSliderModule,
  MdToolbarModule
} from '@angular/material';
import { NgModule } from '@angular/core';
import { WindowRefService } from './window-ref.service';
import 'hammerjs';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent,
    FplFixedDirective
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    JsonpModule,
    MdButtonModule,
    MdCheckboxModule,
    MdInputModule,
    MdSelectModule,
    MdSidenavModule,
    MdSliderModule,
    MdToolbarModule
  ],
	providers: [ FplService, WindowRefService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
