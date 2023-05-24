import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Padlet, User} from "../shared/padlet";
import {PadletFactory} from "../shared/padlet-factory";
import {PadletAppService} from "../shared/padlet-app.service";
import {ActivatedRoute, Router} from "@angular/router";
import {PadletFormErrorMessages} from "./padlet-form-error-messages";
import {AuthenticationService} from "../shared/authentication.service";
import {UserFactory} from "../shared/user-factory";
import {Role} from "../shared/role";
import {PadletUser} from "../shared/padlet-user";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'bs-padlet-form',
  templateUrl: './padlet-form.component.html',
  styles: [
  ]
})
export class PadletFormComponent implements OnInit{

  padletForm : FormGroup;
  //leeres Padlet steht anfangs zur Verfügung
  padlet : Padlet = PadletFactory.empty();
  //leeres errors array anlegen
  errors : {[key:string]: string} = {};
  isUpdatingPadlet = false;
  userId = Number(this.authService.getUserId());

  users : FormArray; //für dropdowns
  allUsers:User[] = [];
  allRoles:Role[] = [];
  userRoles:FormArray;


  constructor(
    private fb: FormBuilder,
    private ps: PadletAppService,
    private route: ActivatedRoute,
    private router: Router,
    public authService: AuthenticationService,
    public toastr: ToastrService
  ) {
    //neue Gruppe/Array anlegen = Padlet Form
    this.padletForm = this.fb.group({});
    this.users = this.fb.array([]);
    this.userRoles = this.fb.array([]);
  }

  ngOnInit(): void {
    //user reinladen
    this.getAllUsers();
    //rollen reinladen
    this.getAllRoles();
    //überprüfen ob id in route ist --> wenn ja update, sonst neu
    const id = this.route.snapshot.params["id"];
    if(id){
      //wenn id vorhanden, updaten, weil padlet besteht
      this.isUpdatingPadlet = true;
      this.ps.getSingle(id).subscribe(
        //bekommene Daten dem padlet objekt zuweisen
        padlet => {
        this.padlet = padlet;
        this.initPadlet();
      }
      );
    }

    this.initPadlet();

  }

  getAllUsers() {
    this.ps.getAllUsers().subscribe(
      users => {
        //mit map nur die user Eigenschaft gespeichert im Array
        this.allUsers = users;
      }
    );
  }

  getAllRoles() {
    this.ps.getAllRoles().subscribe(
      roles => {
        this.allRoles = roles;
      }
    );
  }


  //einzelne properties werden an Formularfelder gebunden + Validierung
  initPadlet(){
    this.buildUserArray();
    this.padletForm = this.fb.group({
      id: this.padlet.id,
      title: [this.padlet.title, Validators.required],
      description: [this.padlet.description],
      is_public: [this.padlet.is_public, Validators.required],
      created_at: new Date(),
      updated_at: new Date(),
      users: this.users,
      userRoles: this.userRoles
    });

    //wenn sich status ändert, werden Validatoren durchlaufen
    this.padletForm.statusChanges.subscribe(() =>
    this.updateErrorMessages());
  }

  //fügt weiteres sub formular hinzu
  addUserControl(){
    this.userRoles.push(this.fb.group({id: 0, user_id: 0, role_id:0}));
  }

  buildUserArray(){
    if(this.padlet.users){
      this.users = this.fb.array([]);
      for(let user of this.padlet.users){
        let fg = this.fb.group({
          id: new FormControl(user.id),
          user_id: new FormControl(user.id),
          role_id: new FormControl(null)
        });
        this.users.push(fg);

      }
    }
  }

  updateErrorMessages(){
    //zu Beginn immer neu, da es neu befüllt wird
    this.errors = {};

    for(const message of PadletFormErrorMessages){
      const control = this.padletForm.get(message.forControl);
      if (
        control &&
        control.dirty &&
        control.invalid && control.errors &&
        control.errors[message.forValidator] &&
        !this.errors[message.forControl]
      ){
        //entsprechende Fehlermeldung speichern
        this.errors[message.forControl] = message.text;
      }
    }

  }

  submitForm(){
    //leere Zeilen von User rausfiltern
    this.padletForm.value.users = this.padletForm.value.users.filter(
      (user: {id: number}) => user.id
    );

    //neues buch mit werten von formular befüllen
    const padlet: Padlet = PadletFactory.fromObject(this.padletForm.value);

    if(this.isUpdatingPadlet){
      padlet.entries = this.padlet.entries;

      this.ps.update({
        id: this.padlet.id,
        title: this.padletForm.value.title,
        description: this.padletForm.value.description,
        is_public: this.padlet.is_public,
        created_at: new Date(),
        updated_at: new Date(),
        user_id: this.padlet.user_id,
        user: this.padlet.user,
        entries: this.padlet.entries,
        users: this.padletForm.value.userRoles.map((user: any) => ({
          padlet_id: this.padlet.id,
          id: user.user_id,
          role_id: user.role_id
        }))
      }).subscribe(res => {
        //wenn update funktioniert hat, zu Übersicht navigieren
        this.toastr.success('"'+this.padlet.title+'" wurde erfolgreich gespeichert');
        this.router.navigate(["../../padlets", padlet.id], {relativeTo: this.route});
      })
      console.log(padlet);
    }
    else{
      console.log("Neues Padlet anlegen");
      //neues Padlet anlegen

      //userId von session storage von auth service auslesen und für den admin des padlets hinterlegen
      const userId = this.authService.getUserId();
      if(userId != null){
        this.padlet.user_id = parseInt(userId);
        this.padlet.is_public = this.padletForm.value.is_public;
      }
      else{
        //wenn kein user eingelogged ist - automatisch public
        this.padlet.user = undefined;
        this.padlet.user_id = undefined;
        this.padlet.is_public = true;
      }

      this.ps.create({
        id: this.padlet.id,
        title: this.padletForm.value.title,
        description: this.padletForm.value.description,
        is_public: this.padlet.is_public,
        created_at: new Date(),
        updated_at: new Date(),
        user_id: this.padlet.user_id,
        user: this.padlet.user,
        users: this.padletForm.value.userRoles.map((user:any) => ({
          padlet_id: this.padlet.id,
          id: user.user_id,
          role_id: user.role_id
        }))
      }).subscribe(res => {
        console.log(res);
        this.toastr.success('Padlet wurde erfolgreich gespeichert');
        //Formular wieder auf leeres Padlet setzen und zurück zur Übersicht
        this.padlet = PadletFactory.empty();
        this.padletForm.reset(PadletFactory.empty());
        this.router.navigate(["../padlets"], {relativeTo: this.route});
      })
    }
  }
}


