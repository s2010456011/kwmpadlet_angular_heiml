import {Component, OnInit} from '@angular/core';
import {Entry, Padlet} from "../shared/entry";
import {PadletAppService} from "../shared/padlet-app.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {PadletFactory} from "../shared/padlet-factory";
import {EntryFactory} from "../shared/entry-factory";

@Component({
  selector: 'bs-entry-detail',
  templateUrl: './entry-detail.component.html',
  styles: [
  ]
})
export class EntryDetailComponent implements OnInit{

  entry: Entry = EntryFactory.empty();

  constructor(
    private ps:PadletAppService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr:ToastrService
  ) {
  }

  ngOnInit():void{
    const params = this.route.snapshot.params;
    this.ps.getSingleEntry(params['entryid']).subscribe((e:Entry) => this.entry = e);  }

}
