import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Entry, User, Padlet, Comment, Rating} from "../shared/entry";
import {PadletAppService} from "../shared/padlet-app.service";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'bs-padlet-list',
  templateUrl: './padlet-list.component.html',
  styles: [
  ]
})
export class PadletListComponent implements OnInit{

  padlets:Padlet[] = [];

  @Output() showDetailsEvent = new EventEmitter<Padlet>();

  //Padlet Service ist somit initalisiert und kann verwendet werden
  constructor(private ps:PadletAppService, private toastr:ToastrService) {
  }

  ngOnInit():void {
    //an Observable subscriben, wenn es ein result gibt, dem padlet array zuweisen
    this.ps.getAll().subscribe(res => this.padlets = res);
    }

  //Funktion emitted das showDetail Event, schickt Padlet mit
  //AppComponent fängt Event auf ändert DetailsOn auf true
  showDetails(padlet:Padlet){
    this.showDetailsEvent.emit(padlet);
  }

}
