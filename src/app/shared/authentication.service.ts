import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import jwt_decode from "jwt-decode";

interface Token{
  exp: number;
  user: {
    id: string;
  }
}

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private api = "http://kwmpadlet.s2010456011.student.kwmhgb.at/api";

  constructor(private http: HttpClient) {

  }

  //login auf REST Service aufrufen, Token Struktur wird zurückgegeben
  login(email:string, password: string){
    return this.http.post(`${this.api}/login`, {email: email, password:password});
  }

  logout(){
    this.http.post(`${this.api}/logout`, {});
    //User id und token aus SessionStorage wieder entfernen
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("userId");
    console.log("Erfolgreich ausgelogged");
  }

  //token zwischenspeicher
  //token und userID wird im sessionStorage gespeichert
  public setSessionStorage(token:string){
    console.log(jwt_decode(token));
    const decodedToken = jwt_decode(token) as Token;
    sessionStorage.setItem("token",token);
    sessionStorage.setItem("userId", decodedToken.user.id);
  }

  //gibt die id des aktuell eingeloggten user zurück
  public getUserId(): string | null {
    return sessionStorage.getItem("userId");
  }

  public isLoggedIn():boolean{
    //wenn token vorhanden ist
    if(sessionStorage.getItem("token")){
      let token: string = <string>sessionStorage.getItem("token");
      const decodedToken = jwt_decode(token) as Token;
      //ablaufdatum = jetziges datum + Laufzeit in Sek vom Token
      let expirationDate: Date = new Date(0);
      expirationDate.setUTCSeconds(decodedToken.exp);
      //aktuelles Datum mit aktuellem vergleichen, prüfen ob abgelaufen
      if(expirationDate < new Date()){
        console.log("token expired");
        return false;
      }
      return true;
    }
    else{
      //kein token vorhanden
      return false;
    }
  }

  //gibt Gegenteil von isLoggedIn zurück
  public isLoggedOut():boolean{
    return !this.isLoggedIn();
  }
}
