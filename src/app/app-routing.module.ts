import {Router, RouterModule, Routes} from "@angular/router";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {PadletDetailsComponent} from "./padlet-details/padlet-details.component";
import {NgModule} from "@angular/core";
import {PadletListComponent} from "./padlet-list/padlet-list.component";
import {PadletFormComponent} from "./padlet-form/padlet-form.component";
import {EntryDetailComponent} from "./entry-detail/entry-detail.component";
import {EntryFormComponent} from "./entry-form/entry-form.component";

//default Pfad = '' leitet zu route dashboard, kompletter Pfad (full)
//dashboard route lädt DashboardCompinent
const routes: Routes =  [
  {path: '', redirectTo: 'padlets', pathMatch: 'full'},
  {path: 'padlets', component: PadletListComponent},
  {path: 'padlets/:id', component:PadletDetailsComponent},
  {path: 'create', component:PadletFormComponent},
  {path: 'create/:id', component:PadletFormComponent},
  {path: 'entries/:entryid', component:EntryFormComponent}

];

//routing Modul
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})

export class AppRoutingModule{}
