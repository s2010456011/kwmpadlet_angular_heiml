import {User} from "./user";
import {Entry} from "./entry";

export class Rating {
  constructor(
    public id: number,
    public number:number,
    public user_id:number,
    public user:User
  ) {
  }
}
