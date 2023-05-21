export class ErrorMessage {

  constructor(
    public forControl: string,
    public forValidator: string,
    public text: string
  ) {

  }

}

//einzelne Error Message Objetke anlegen
export const PadletFormErrorMessages = [
  new ErrorMessage('title', 'required', 'Ein Titel muss angegeben werden')
];
