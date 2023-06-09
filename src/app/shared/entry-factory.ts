import {Entry, Padlet, User} from "./padlet";
import {Comment} from "./comment";
import {Rating} from "./rating";
import {Validators} from "@angular/forms";

export class EntryFactory {

  //gibt leeres Entry Objekt zurück welches Befüllt werden kann
  static empty(): Entry {
    return new Entry(
      0,
      '',
      new Date(),
      new Date(),
      0,
      0,
      { id: 0, firstname: '', lastname: '', image: '', email: '' },
      [], [], ''
  );
  }


  //raw Ergebnis von Result wird in Angular Objekt umgewandelt
  static fromObject (rawEntry: any): Entry{
    return new Entry(
      rawEntry.id,
      rawEntry.title,
      rawEntry.created_at,
      rawEntry.updated_at,
      rawEntry.padlet_id,
      rawEntry.user_id,
      rawEntry.user,
      rawEntry.comments,
      rawEntry.ratings,
      rawEntry.text
    )
  }



}
