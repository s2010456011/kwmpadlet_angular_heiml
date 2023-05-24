import {Entry} from "./entry";
export {Entry} from "./entry";
import {User} from "./user";
import {PadletUser} from "./padlet-user";
export {User} from "./user";

export class Padlet {
  constructor(
    public id: number,
    public title: string,
    public is_public: boolean,
    public created_at: Date,
    public updated_at: Date,
    public user_id?: number,
    public user?: User,
    public users?: User[],
    public entries?: Entry[],
    public description?: string,
) {
  }
}
