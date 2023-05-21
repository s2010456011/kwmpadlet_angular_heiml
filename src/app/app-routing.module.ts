import {Router, RouterModule, Routes} from "@angular/router";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {PadletDetailsComponent} from "./padlet-details/padlet-details.component";
import {NgModule} from "@angular/core";
import {PadletListComponent} from "./padlet-list/padlet-list.component";

//default Pfad = '' leitet zu route dashboard, kompletter Pfad (full)
//dashboard route lädt DashboardCompinent
const routes: Routes =  [
  {path: '', redirectTo: 'padlets', pathMatch: 'full'},
  {path: 'padlets', component: PadletListComponent},
  {path: 'padlets/:id', component:PadletDetailsComponent}
];

//routing Modul
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})

export class AppRoutingModule{}
