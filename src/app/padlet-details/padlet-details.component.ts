import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Entry, Padlet, User} from "../shared/padlet";
import {PadletAppService} from "../shared/padlet-app.service";
import {ActivatedRoute, Router} from "@angular/router";
import {relative} from "@angular/compiler-cli";
import {PadletFactory} from "../shared/padlet-factory";
import {ToastrService} from "ngx-toastr";
import {EntryFactory} from "../shared/entry-factory";
import {AuthenticationService} from "../shared/authentication.service";
import {PadletUser} from "../shared/padlet-user";

@Component({
  selector: 'bs-padlet-details',
  templateUrl: './padlet-details.component.html',
  styles: [
  ]
})

export class PadletDetailsComponent {

  //sichergestellt, dass immer ein Padlet Objekt zur Verfügung steht, somit nie undefined
  padlet : Padlet = PadletFactory.empty();
  entry : Entry = EntryFactory.empty();
  padletUser:PadletUser[] =[];
  users:User[] = [];
  curUser = Number(this.authService.getUserId());

  //actived Route um URL auszuwerten und Parameter davon rauszuholen
  constructor(
    public ps:PadletAppService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr:ToastrService,
    public authService: AuthenticationService
  ) {
  }

  //URL zerlegn um ID an getSinlge zu übergebn
  ngOnInit(){
    //paramter aus URL in array params speichern
    //wenn Padlet zur Verfügung steht, wenn Padlet geladen wurde, wird es aktualisiert und zugewiesen
    const params = this.route.snapshot.params;
    this.ps.getSingle(params['id']).subscribe((p:Padlet) => {
      this.padlet = p;
      console.log(this.padlet.users);
    });
  }

  getRating(num: number){
    return new Array(num);
  }

  removePadlet(){
    const userId = this.authService.getUserId();

    //Löschen nur für Ersteller von Padlets
    if(this.padlet.user_id == Number(userId)){
      if (confirm('Padlet wirklich endgültig löschen?')){
        this.ps.remove(this.padlet?.id).subscribe(
          (res:any) => this.router.navigate(['../'], {relativeTo:this.route}));
        //toastr message
        this.toastr.success(`'${this.padlet?.title}' wurde gelöscht`);
      }
    }
    else{
      alert("Nur der/die Ersteller/in darf dieses Padlet löschen");
    }
  }

  removeEntry(entry: Entry) {
    if (confirm("Entry wirklich endgültig löschen?")) {
      this.ps.removeEntry(entry?.id).subscribe((res: any) => {
        this.toastr.success(`Ein Eintrag wurde gelöscht`);
        this.router.navigate(['../../padlets', this.padlet.id]);
      });
    }
  }





}
