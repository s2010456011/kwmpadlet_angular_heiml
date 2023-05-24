import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { PadletListComponent } from './padlet-list/padlet-list.component';
import { PadletListItemComponent } from './padlet-list-item/padlet-list-item.component';
import { PadletDetailsComponent } from './padlet-details/padlet-details.component';
import {PadletAppService} from "./shared/padlet-app.service";
import {AppRoutingModule} from "./app-routing.module";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {ToastrModule} from "ngx-toastr";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {PadletFormComponent} from './padlet-form/padlet-form.component';
import {ReactiveFormsModule} from "@angular/forms";
import { EntryDetailComponent } from './entry-detail/entry-detail.component';
import { EntryFormComponent } from './entry-form/entry-form.component';
import { LoginComponent } from './login/login.component';
import {AuthenticationService} from "./shared/authentication.service";
import {TokenInterceptorService} from "./shared/token-interceptor.service";
import {JwtInterceptorService} from "./shared/jwt-interceptor.service";


@NgModule({
  declarations: [
    AppComponent,
    PadletListComponent,
    PadletListItemComponent,
    PadletDetailsComponent,
    PadletFormComponent,
    EntryDetailComponent,
    EntryFormComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule, AppRoutingModule, HttpClientModule, ReactiveFormsModule,
    ToastrModule.forRoot(), BrowserAnimationsModule
  ],
  providers: [PadletAppService, AuthenticationService, {
    provide : HTTP_INTERCEPTORS,
    useClass: TokenInterceptorService,
    multi : true
  },
    {
      provide : HTTP_INTERCEPTORS,
      useClass: JwtInterceptorService,
      multi : true
    }],
  bootstrap: [AppComponent]
})
export class AppModule { }
