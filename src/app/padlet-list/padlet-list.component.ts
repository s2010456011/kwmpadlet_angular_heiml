import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Entry, User, Padlet, Comment, Rating} from "../shared/entry";
import {PadletAppService} from "../shared/padlet-app.service";
import {ToastrService} from "ngx-toastr";
import {AuthenticationService} from "../shared/authentication.service";

@Component({
  selector: 'bs-padlet-list',
  templateUrl: './padlet-list.component.html',
  styles: [
  ]
})
export class PadletListComponent implements OnInit{

  myPadlets:Padlet[] = [];
  allPadlets:Padlet[] = [];

  @Output() showDetailsEvent = new EventEmitter<Padlet>();

  //Padlet Service ist somit initalisiert und kann verwendet werden
  constructor(private ps:PadletAppService, private toastr:ToastrService, private authService:AuthenticationService) {
  }

  ngOnInit():void {
    const userId = this.authService.getUserId();

    //an Observable subscriben, wenn es ein result gibt, dem padlet array zuweisen
    this.ps.getAll().subscribe(padlets => {
      // Filtere die Padlets nach user_id
      this.myPadlets = padlets.filter(padlet => padlet.user_id === Number(userId));
    });

    //an Observable subscriben, wenn es ein result gibt, dem padlet array zuweisen
    this.ps.getAll().subscribe(padlets => {
      if(this.authService.isLoggedIn()){
        this.allPadlets = padlets.filter(padlet => padlet.user_id !== Number(userId)
          //entweder public oder sonst jene wo angemeldeter User eingeladen wurde
          && (padlet.is_public || padlet.users?.some(user => user.id === Number(userId))));
      }

      else{
        //nicht eingeloggte User sehen nur öffentliche Padlets
        this.allPadlets = padlets.filter(padlet => padlet.user_id !== Number(userId) && padlet.is_public);
      }
    });
    }

  //Funktion emitted das showDetail Event, schickt Padlet mit
  //AppComponent fängt Event auf ändert DetailsOn auf true
  showDetails(padlet:Padlet){
    this.showDetailsEvent.emit(padlet);
  }

}
