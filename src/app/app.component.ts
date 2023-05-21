import { Component } from '@angular/core';
import {Padlet} from "./shared/padlet";

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

}
