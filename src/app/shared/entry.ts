import {Padlet} from "./padlet";
export {Padlet} from "./padlet";
import {User} from "./user";
export {User} from "./user";
import {Comment} from "./comment";
export {Comment} from "./comment";
import {Rating} from "./rating";
export {Rating} from "./rating";


export class Entry {
  constructor(
    public id: number,
    public title: string,
    public created_at:Date,
    public updated_at:Date,
    public user_id:number,
    public padlet_id:number,
    public user: User,
    public comments?:Comment[],
    public ratings?:Rating[],
    public text?: string
  ) {
  }
}
