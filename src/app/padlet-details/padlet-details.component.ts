import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Padlet} from "../shared/padlet";
import {PadletAppService} from "../shared/padlet-app.service";
import {ActivatedRoute, Router} from "@angular/router";
import {relative} from "@angular/compiler-cli";
import {PadletFactory} from "../shared/padlet-factory";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'bs-padlet-details',
  templateUrl: './padlet-details.component.html',
  styles: [
  ]
})
export class PadletDetailsComponent {

  //sichergestellt, dass immer ein Padlet Objekt zur Verfügung steht, somit nie undefined
  padlet : Padlet = PadletFactory.empty();

  //actived Route um URL auszuwerten und Parameter davon rauszuholen
  constructor(
    private ps:PadletAppService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr:ToastrService
  ) {
  }

  //URL zerlegn um ID an getSinlge zu übergebn
  ngOnInit(){
    //paramter aus URL in array params speichern
    //wenn Padlet zur Verfügung steht, wenn Padlet geladen wurde, wird es aktualisiert und zugewiesen
    const params = this.route.snapshot.params;
    this.ps.getSingle(params['id']).subscribe((p:Padlet) => this.padlet = p);
  }

  getRating(num: number){
    return new Array(num);
  }

  removePadlet(){
    if (confirm('Padlet wirklich endgültig löschen?')){
      this.ps.remove(this.padlet?.id).subscribe(
        (res:any) => this.router.navigate(['../'], {relativeTo:this.route}));
      //toastr message
      this.toastr.success(`'${this.padlet?.title}' wurde gelöscht`);
    }
  }


}
