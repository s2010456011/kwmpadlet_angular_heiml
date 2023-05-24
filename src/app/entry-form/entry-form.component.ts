import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Entry, Padlet, User} from "../shared/padlet";
import {PadletFactory} from "../shared/padlet-factory";
import {PadletAppService} from "../shared/padlet-app.service";
import {ActivatedRoute, Router} from "@angular/router";
import {EntryFactory} from "../shared/entry-factory";
import {EntryFormErrorMessages} from "./entry-form-error-messages";
import {AuthenticationService} from "../shared/authentication.service";
import {ToastrService} from "ngx-toastr";

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
    public authService: AuthenticationService,
    public toastr: ToastrService

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
      for(let c of this.entry.comments){
        let fg = this.fb.group({
          id: new FormControl(c.id),
          user_id : new FormControl(c.user_id),
          text: new FormControl(c.text),
          user: new FormControl(c.user)
        });
        this.comments.push(fg);
      }
    }
  }

  buildRatingsArray(){
    if(this.entry.ratings){
      this.ratings = this.fb.array([]);
      for(let r of this.entry.ratings){
        let fg = this.fb.group({
          id: new FormControl(r.id ),
          user_id : new FormControl(r.user_id),
          number: new FormControl(r.number, [Validators.min(0), Validators.max(5)]),
          user: new FormControl(r.user)
        });
        this.ratings.push(fg);
      }
    }
    console.log(this.ratings);
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
        this.router.navigate(["../"], {relativeTo: this.route});
      })
      console.log(entry);

    }
    else{
      //neuen Entry anlegen

      //userId von session storage von auth service auslesen und für den admin des padlets hinterlegen
      const userId = this.authService.getUserId();

      if(userId != null){
        entry.user_id = parseInt(userId);

        //bei neuem anlegen sollen die dabei hinzugefügten ratings und comments die id des aktuellen users haben
        for (let rating of this.entryForm.value.ratings) {
        rating.user_id = userId;
          this.ps.getSinlgeUser(parseInt(userId)).subscribe(user => {
            rating.user = user;
          });
        }
        for (let comment of this.entryForm.value.comments) {
          comment.user_id = userId;
          this.ps.getSinlgeUser(parseInt(userId)).subscribe(user => {
            comment.user = user;
            console.log(comment.user.firstname)
          });
          }
      }
      else{
        //wenn kein user eingelogged ist - automatisch public
        entry.user = undefined;
        entry.user_id = undefined;
      }

      console.log(entry);
      this.ps.createEntry(entry).subscribe(res => {
        this.toastr.success('Ein neuer Eintrag wurde hinzugefügt!');
        //Formular wieder auf leeres Padlet setzen und zurück zur Übersicht
        this.entry = EntryFactory.empty();
        this.entryForm.reset(EntryFactory.empty());
        this.router.navigate(["../../"], {relativeTo: this.route});
      })
    }
  }

}


