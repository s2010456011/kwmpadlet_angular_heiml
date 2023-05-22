import {min} from "rxjs";

export class ErrorMessage {

  constructor(
    public forControl: string,
    public forValidator: string,
    public text: string
  ) {

  }

}

//einzelne Error Message Objetke anlegen
export const EntryFormErrorMessages = [
  new ErrorMessage('number', 'min', 'Der Wert muss mindestens 0 betragen'),
  new ErrorMessage('number', 'max', 'Der Wert darf maximal 5 betragen')
];
