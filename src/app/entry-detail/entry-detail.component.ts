import {Component, OnInit} from '@angular/core';
import {Entry, Padlet, User} from "../shared/entry";
import {PadletAppService} from "../shared/padlet-app.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {PadletFactory} from "../shared/padlet-factory";
import {EntryFactory} from "../shared/entry-factory";
import {AuthenticationService} from "../shared/authentication.service";
import {UserFactory} from "../shared/user-factory";

@Component({
  selector: 'bs-entry-detail',
  templateUrl: './entry-detail.component.html',
  styles: [
  ]
})
export class EntryDetailComponent implements OnInit{

  entry: Entry = EntryFactory.empty();
  user: User = UserFactory.empty();

  constructor(
    private ps:PadletAppService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr:ToastrService,
    public authService: AuthenticationService

  ) {
  }

  ngOnInit():void{
    const params = this.route.snapshot.params;
    this.ps.getSingleEntry(params['entryid']).subscribe((e:Entry) => {
      this.entry = e;
      }
    );
  }

  getRating(num: number){
    console.log(this.entry?.ratings);
    return new Array(num);
  }


//remove methode von entry detail ansicht aus!
  removeEntry(entry: Entry) {
    if (confirm("Entry wirklich endgültig löschen?")) {
      this.ps.removeEntry(entry?.id).subscribe(
        (res: any) => {
          this.router.navigate(['../../'], { relativeTo: this.route });
          //toastr message
          this.toastr.success(`'${this.entry?.title}' wurde gelöscht`);
        }
      );
    }
  }



}
