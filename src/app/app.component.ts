import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Padlet} from "./shared/padlet";
import {AuthenticationService} from "./shared/authentication.service";
import {debounceTime, distinctUntilChanged, switchMap} from "rxjs";
import {PadletAppService} from "./shared/padlet-app.service";
import {ActivatedRoute, Router} from "@angular/router";

//list ansicht wird nur geladen, wenn variable listOn auf true ist
//mit property binding wird padlet mitübergeben
//wenn auf ListComponent geklickt wird, dann wird Details ausgelöst und showDetails aufgerufen, Padlet wird mitgegeben
@Component({
  selector: 'bs-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit{

  //zeigt an, welche Ansicht gerade angezeigt wird
  listOn = true;
  detailsOn = false;

  padlet : Padlet | undefined;

  //Auth Service für Information ob eineglogged oder nicht
  constructor(
    private authService:AuthenticationService,
    private ps:PadletAppService,
    private route: ActivatedRoute,
    public router: Router) {

  }

  isLoggedIn():boolean{
    return this.authService.isLoggedIn();
  }

  getLoginLabel():string{
    return this.isLoggedIn() ? "Logout" : "Login";
  }

  //für Suche
  keyup = new EventEmitter<string>();
  foundPadlets: Padlet[] = [];
  dropdownVisible = true;
  @Output() padletSelected = new EventEmitter<Padlet>;

  ngOnInit() {
    //mit verzögerung von 500 millisekunden --> für weniger requests
    //switchMap --> eingegebenr wert in string und an padlet service übergeben
    this.keyup.pipe(debounceTime(500)).pipe(distinctUntilChanged())
      .pipe(switchMap(searchTerm => this.ps.getAllSearch(searchTerm))).subscribe((padlets => this.foundPadlets = padlets));
  }

  selectPadlet(padlet: Padlet) {
    this.dropdownVisible = false;
    this.router.navigate(['../padlets/', padlet.id], { relativeTo: this.route });
  }

}
