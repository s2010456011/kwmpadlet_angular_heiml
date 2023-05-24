

import {Entry, Padlet, User} from "./padlet";
import {Comment} from "./comment";
import {Rating} from "./rating";
import {Validators} from "@angular/forms";

export class UserFactory {

  //gibt leeres User Objekt zurück welches Befüllt werden kann
  static empty(): User {
    return new User(
      0,
      'Anonym',
      '',
      '',
      ''
    );
  }


  /*//raw Ergebnis von Result wird in Angular Objekt umgewandelt
  static fromObject (rawEntry: any): Entry{
    return new Entry(
      rawEntry.id,
      rawEntry.title,
      rawEntry.created_at,
      rawEntry.updated_at,
      rawEntry.user_id,
      rawEntry.padlet_id,
      rawEntry.user,
      rawEntry.comments,
      rawEntry.ratings,
      rawEntry.text
    )
  }*/



}
