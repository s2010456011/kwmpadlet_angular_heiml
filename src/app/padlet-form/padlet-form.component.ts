import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Padlet, User} from "../shared/padlet";
import {PadletFactory} from "../shared/padlet-factory";
import {PadletAppService} from "../shared/padlet-app.service";
import {ActivatedRoute, Router} from "@angular/router";
import {PadletFormErrorMessages} from "./padlet-form-error-messages";

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
  users : FormArray;

  constructor(
    private fb: FormBuilder,
    private ps: PadletAppService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    //neue Gruppe anlegen = Padlet Form
    this.padletForm = this.fb.group({});
    this.users = this.fb.array([]);
  }

  ngOnInit(): void {
    //überprüfen ob id in route ist --> wenn ja update, sonst neu
    const id = this.route.snapshot.params["id"];
    if(id){
      //wenn id vorhanden, zustand ändern
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

  //einzelne properties werden an Formularfelder gebunden + Validierung
  initPadlet(){

    this.buildUserArray();
    this.padletForm = this.fb.group({
      id: this.padlet.id,
      title: [this.padlet.title, Validators.required],
      description: [this.padlet.description],
      is_public: [this.padlet.is_public, Validators.required],
      //is_public: [true, Validators.required],
      created_at: new Date(),
      updated_at: new Date(),
      users: this.users
    });



    //wenn sich status ändert, werden Validatoren durchlaufen
    this.padletForm.statusChanges.subscribe(() =>
    this.updateErrorMessages());
  }

 buildUserArray(){
  if(this.padlet.users){
    this.users = this.fb.array([]);
    for(let user of this.padlet.users){
      let fg = this.fb.group({
        id: new FormControl(user.id),
        user: new FormControl(user.id),
        //role: new FormControl(user.role_id)
      });
      this.users.push(fg);
    }
  }
}

  addUserControl(){
    this.users.push(this.fb.group({id: 0, firstname: '', lastname:'', image:'', email:''}));
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
    padlet.entries = this.padlet.entries;
    if(this.isUpdatingPadlet){
      this.ps.update(padlet).subscribe(res => {
        //wenn update funktioniert hat, zu Übersicht navigieren
        this.router.navigate(["../../padlets", padlet.id], {relativeTo: this.route});
      })
      console.log(padlet);

    }
    else{
      //neues Buch anlegen
      //TODO is_public auslesen lassen
      padlet.user_id = 1;
      padlet.is_public = false;
      this.ps.create(padlet).subscribe(res => {
        //Formular wieder auf leeres Padlet setzen und zurück zur Übersicht
        this.padlet = PadletFactory.empty();
        this.padletForm.reset(PadletFactory.empty());
        this.router.navigate(["../padlets"], {relativeTo: this.route});
      })
    }
  }

}


