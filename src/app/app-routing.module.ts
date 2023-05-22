import {Router, RouterModule, Routes} from "@angular/router";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {PadletDetailsComponent} from "./padlet-details/padlet-details.component";
import {NgModule} from "@angular/core";
import {PadletListComponent} from "./padlet-list/padlet-list.component";
import {PadletFormComponent} from "./padlet-form/padlet-form.component";
import {EntryDetailComponent} from "./entry-detail/entry-detail.component";
import {EntryFormComponent} from "./entry-form/entry-form.component";
import {LoginComponent} from "./login/login.component";

//default Pfad = '' leitet zu route dashboard, kompletter Pfad (full)
//dashboard route lädt DashboardCompinent
const routes: Routes =  [
  {path: '', redirectTo: 'padlets', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'padlets', component: PadletListComponent},
  {path: 'padlets/:id', component:PadletDetailsComponent},
  {path: 'create', component:PadletFormComponent},
  {path: 'create/:id', component:PadletFormComponent},
  {path: 'padlets/:id/entries/edit', component:EntryFormComponent},
  {path: 'padlets/:id/entries/:entryid/edit', component:EntryFormComponent},
  {path: 'padlets/:id/entries/:entryid', component:EntryDetailComponent}

];

//routing Modul
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})

export class AppRoutingModule{}
