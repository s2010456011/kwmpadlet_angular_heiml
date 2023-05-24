import {User} from "./user";
export {User} from "./user";

export class Comment {
  constructor(
    public id: number,
    public text:string,
    public user_id:number,
    public user:User
  ) {
  }
}
