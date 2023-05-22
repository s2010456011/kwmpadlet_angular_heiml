import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Entry, Padlet, User} from "../shared/padlet";
import {PadletFactory} from "../shared/padlet-factory";
import {PadletAppService} from "../shared/padlet-app.service";
import {ActivatedRoute, Router} from "@angular/router";
import {EntryFactory} from "../shared/entry-factory";
import {EntryFormErrorMessages} from "./entry-form-error-messages";
import {AuthenticationService} from "../shared/authentication.service";

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
  padlet_id:number = 0;

  constructor(
    private fb: FormBuilder,
    private ps: PadletAppService,
    private route: ActivatedRoute,
    private router: Router,
    public authService: AuthenticationService

  ) {
    //neue Gruppe anlegen = Padlet Form
    this.entryForm = this.fb.group({});
    this.comments = this.fb.array([]);
    this.ratings = this.fb.array([]);
  }

  ngOnInit(): void {
    //überprüfen ob id in route ist --> wenn ja update, sonst neu
    const id = this.route.snapshot.params["entryid"];
    this.route.params.subscribe(params => {
      //padlet id aus URL auslesen um anschließend zuordnen zu können
      this.padlet_id = this.route.snapshot.params["id"];
    });

    if(id){
      //wenn id vorhanden, zustand ändern
      this.isUpdatingEntry = true;
      this.ps.getSingleEntry(id).subscribe(
        //bekommene Daten dem padlet objekt zuweisen
        entry => {
          this.entry = entry;
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
      user_id: this.entry.user_id,
      padlet_id: this.padlet_id,
      user: this.entry.user,
      comments : this.comments,
      ratings: this.ratings,
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
          text: new FormControl(comment.text),
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
          number: new FormControl(rating.number, [Validators.min(0), Validators.max(5)])
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
    console.log("Is form invalid? " + this.entryForm.invalid);
    this.errors = {};

    for(const message of EntryFormErrorMessages){
      const control = this.entryForm.get(message.forControl);
      if (
        control &&
        control.dirty &&
        control.invalid && control.errors &&
        control.errors[message.forValidator]&&
        !this.errors[message.forControl]
      ){
        //entsprechende Fehlermeldung speichern
        this.errors[message.forControl] = message.text;
      }
    }

  }

  submitForm(){
   ///leere Zeilen von comment rausfiltern
    this.entryForm.value.comments = this.entryForm.value.comments.filter(
      (comment: {text: string}) => comment.text
    );

    //leere Zeilen von rating rausfiltern
    this.entryForm.value.ratings = this.entryForm.value.ratings.filter(
      (rating: {number: number}) => rating.number
    );

    //neues buch mit werten von formular befüllen
    const entry: Entry = EntryFactory.fromObject(this.entryForm.value);
    //entry.entries = this.padlet.entries;
    if(this.isUpdatingEntry){
      this.ps.updateEntry(entry).subscribe(res => {
        //wenn update funktioniert hat, zu Übersicht navigieren
        this.router.navigate(["../../../"], {relativeTo: this.route});
      })
      console.log(entry);

    }
    else{
      //neuen Entry anlegen
      entry.user_id = 1;
      console.log(entry);
      this.ps.createEntry(entry).subscribe(res => {
        //Formular wieder auf leeres Padlet setzen und zurück zur Übersicht
        this.entry = EntryFactory.empty();
        this.entryForm.reset(EntryFactory.empty());
        this.router.navigate(["../../"], {relativeTo: this.route});
      })
    }
  }

}


