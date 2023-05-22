import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

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


}
