import {Entry, Padlet, User} from "./padlet";

export class PadletFactory {

  //gibt leeres Padlet Objekt zurück welches Befüllt werden kann
  static empty() : Padlet{
    return new Padlet(0, '', true, 0, new Date(), new Date(),
      ({id: 0, firstname: '', lastname:'', image:'', email:''}),
      [({id: 0, firstname: '', lastname:'', image:'', email:''})], [], '');
  }

  //raw Ergebnis von Result wird in Angular Objekt umgewandelt
  static fromObject (rawPadlet: any): Padlet{
    return new Padlet(
      rawPadlet.id,
      rawPadlet.title,
      rawPadlet.is_public,
      rawPadlet.user_id,
      rawPadlet.created_at,
      rawPadlet.updated_at,
      rawPadlet.user,
      rawPadlet.users,
      rawPadlet.entries,
      rawPadlet.description,

    )
}


}
