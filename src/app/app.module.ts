import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { PadletListComponent } from './padlet-list/padlet-list.component';
import { PadletListItemComponent } from './padlet-list-item/padlet-list-item.component';
import { PadletDetailsComponent } from './padlet-details/padlet-details.component';
import {PadletAppService} from "./shared/padlet-app.service";
import {AppRoutingModule} from "./app-routing.module";
import {HttpClientModule} from "@angular/common/http";
import {ToastrModule} from "ngx-toastr";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

@NgModule({
  declarations: [
    AppComponent,
    PadletListComponent,
    PadletListItemComponent,
    PadletDetailsComponent
  ],
  imports: [
    BrowserModule, AppRoutingModule, HttpClientModule,
    ToastrModule.forRoot(), BrowserAnimationsModule
  ],
  providers: [PadletAppService],
  bootstrap: [AppComponent]
})
export class AppModule { }
