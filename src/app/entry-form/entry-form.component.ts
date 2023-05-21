import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Entry, Padlet, User} from "../shared/padlet";
import {PadletFactory} from "../shared/padlet-factory";
import {PadletAppService} from "../shared/padlet-app.service";
import {ActivatedRoute, Router} from "@angular/router";
import {EntryFactory} from "../shared/entry-factory";
import {PadletFormErrorMessages} from "../padlet-form/padlet-form-error-messages";

@Component({
  selector: 'bs-entry-form',
  templateUrl: './entry-form.component.html',
  styles: [
  ]
})
export class EntryFormComponent implements OnInit{

  entryForm : FormGroup;
  //leeres Padlet steht anfangs zur Verfügung
  entry : Entry = EntryFactory.empty();
  //leeres errors array anlegen
  errors : {[key:string]: string} = {};
  isUpdatingEntry = false;
  comments: FormArray;
  ratings: FormArray;

  constructor(
    private fb: FormBuilder,
    private ps: PadletAppService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    //neue Gruppe anlegen = Padlet Form
    this.entryForm = this.fb.group({});
    this.comments = this.fb.array([])
    this.ratings = this.fb.array([])
  }

  ngOnInit(): void {
    //überprüfen ob id in route ist --> wenn ja update, sonst neu
    const id = this.route.snapshot.params["entryid"];
    if(id){
      //wenn id vorhanden, zustand ändern
      this.isUpdatingEntry = true;
      this.ps.getSingleEntry(id).subscribe(
        //bekommene Daten dem padlet objekt zuweisen
        entry => {
          this.entry = entry;
          console.log(entry);
          this.initEntry();
        }
      );
    }

    this.initEntry();

  }

  //einzelne properties werden an Formularfelder gebunden + Validierung
  initEntry(){

    this.buildCommentsArray();
    this.buildRatingsArray();
    this.entryForm = this.fb.group({
      id: this.entry.id,
      title: [this.entry.title, Validators.required],
      created_at: new Date(),
      updated_at: new Date(),
      user_id: [this.entry.user_id],
      user: this.entry.user,
      comments : this.entry.comments,
      ratings: this.entry.ratings,
      text: this.entry.text
    });


    //wenn sich status ändert, werden Validatoren durchlaufen
    this.entryForm.statusChanges.subscribe(() =>
      this.updateErrorMessages());
  }

  buildCommentsArray(){
    if(this.entry.comments){
      this.comments = this.fb.array([]);
      for(let comment of this.entry.comments){
        let fg = this.fb.group({
          id: new FormControl(comment.id),
          title: new FormControl(comment.text),
          //user: new FormControl(comment.user)
        });
        this.comments.push(fg);
      }
    }
  }

  buildRatingsArray(){
    if(this.entry.ratings){
      this.ratings = this.fb.array([]);
      for(let rating of this.entry.ratings){
        let fg = this.fb.group({
          id: new FormControl(rating.id),
          number: new FormControl(rating.number,
            [Validators.required,
            Validators.minLength(0),
            Validators.maxLength(5)])
          //user: new FormControl(rating.user)
        });
        this.ratings.push(fg);
      }
    }
  }

  addCommentControl(){
    this.comments.push(this.fb.group({id: 0, text: ''}));
  }

  addRatingControl(){
    this.ratings.push(this.fb.group({id: 0, number: ''}));
  }

  updateErrorMessages(){
    //zu Beginn immer neu, da es neu befüllt wird
    this.errors = {};

    for(const message of PadletFormErrorMessages){
      const control = this.entryForm.get(message.forControl);
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
    /*//leere Zeilen von User rausfiltern
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
    }*/
  }

}


