import {Padlet, User} from "./padlet";
import {Role} from "./role";

export class PadletUser {

  constructor(
    public user_id:number,
    public padlet_id:number,
    public role_id:number,
    public user:User,
    public padlet:Padlet,
    public role:Role
  ) {
  }
}
