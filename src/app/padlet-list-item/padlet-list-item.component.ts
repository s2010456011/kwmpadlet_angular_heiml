import { Component, OnInit, Input } from '@angular/core';
import {Padlet} from "../shared/padlet";

@Component({
  selector: 'a.bs-padlet-list-item',
  templateUrl: './padlet-list-item.component.html',
  styles: [
  ]
})
export class PadletListItemComponent implements  OnInit{

  //von der übergeordneten Komponente (padlet-list) bekommen wir das Padlet übergeben
  //muss hier über Input implementiert werden
  @Input() padlet : Padlet | undefined;

  ngOnInit(): void {


  }

}
