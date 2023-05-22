import { Component } from '@angular/core';
import {Padlet} from "./shared/padlet";
import {AuthenticationService} from "./shared/authentication.service";

//list ansicht wird nur geladen, wenn variable listOn auf true ist
//mit property binding wird padlet mitübergeben
//wenn auf ListComponent geklickt wird, dann wird Details ausgelöst und showDetails aufgerufen, Padlet wird mitgegeben
@Component({
  selector: 'bs-root',
  templateUrl: './app.component.html'
})
export class AppComponent {

  //zeigt an, welche Ansicht gerade angezeigt wird
  listOn = true;
  detailsOn = false;

  padlet : Padlet | undefined;

  //Auth Service für Information ob eineglogged oder nicht
  constructor(private authService:AuthenticationService) {

  }

  isLoggedIn():boolean{
    return this.authService.isLoggedIn();
  }

  getLoginLabel():string{
    return this.isLoggedIn() ? "Logout" : "Login";
  }

}
