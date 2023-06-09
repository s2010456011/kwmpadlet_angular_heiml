import { Injectable } from '@angular/core';
import {Padlet} from "./padlet";
import {Entry} from "./entry";
import {User} from "./user";
import {Comment} from "./comment";
import {Rating} from "./rating";
import {HttpClient} from "@angular/common/http";
import {forkJoin, mergeMap, ObjectUnsubscribedError, Observable, throwError} from "rxjs";
import {catchError, retry} from "rxjs/operators";
import {Role} from "./role";

@Injectable({
  providedIn: 'root'
})
export class PadletAppService {

  //API eintragen, URL zu REST Servcie
  private api = 'http://kwmpadlet.s2010456011.student.kwmhgb.at/api';


  constructor(private http:HttpClient) {

  }

  //übergibt in der payload das padlet
  create(padlet:Padlet):Observable<any>{
    return this.http.post(`${this.api}/padlets`, padlet).pipe(retry(3)).pipe(catchError(this.errorHandler));
  }

  //übergibt in der payload das padlet
  createEntry(entry:Entry):Observable<any>{
    return this.http.post(`${this.api}/entries`, entry).pipe(retry(3)).pipe(catchError(this.errorHandler));
  }

  //id der aktuellen padlet objekts zusätzlich
  update(padlet:Padlet):Observable<any>{
    return this.http.put(`${this.api}/padlets/${padlet.id}`, padlet).pipe(retry(3)).pipe(catchError(this.errorHandler));
  }

  //id der aktuellen padlet objekts zusätzlich
  updateEntry(entry:Entry):Observable<any>{
    return this.http.put(`${this.api}/entries/${entry.id}`, entry).pipe(retry(3)).pipe(catchError(this.errorHandler));
  }

  //buch über id löschen, id wird von url ausgelesen
  remove(id:number):Observable<any>{
    return this.http.delete(`${this.api}/padlets/${id}`).pipe(retry(3)).pipe(catchError(this.errorHandler));
  }

  //buch über id löschen, id wird von url ausgelesen
  removeEntry(id:number):Observable<any>{
    return this.http.delete(`${this.api}/entries/${id}`).pipe(retry(3)).pipe(catchError(this.errorHandler));
  }

  //gibt ein Array an Padlets zurück
  getAll():Observable<Array<Padlet>>{
    //über http alle padlets zurückgegebn
    //über pipe mehrer methoden aneinander hängen, soll 3 mal wiederholt werden bei error
    return this.http.get<Array<Padlet>>(`${this.api}/padlets`).pipe(retry(3)).pipe(catchError(this.errorHandler));
  }

  //gibt ein Array an Padlets zurück
  getAllEntries():Observable<Array<Entry>>{
    //über http alle entries zurückgegebn
    //über pipe mehrer methoden aneinander hängen, soll 3 mal wiederholt werden bei error
    return this.http.get<Array<Entry>>(`${this.api}/entries`).pipe(retry(3)).pipe(catchError(this.errorHandler));
  }

  //gibt ein Array an User zurück
  getAllUsers():Observable<Array<User>>{
    //über pipe mehrer methoden aneinander hängen, soll 3 mal wiederholt werden bei error
    return this.http.get<Array<User>>(`${this.api}/users`).pipe(retry(3)).pipe(catchError(this.errorHandler));
  }

  //gibt ein Array an Rollen zurück
  getAllRoles():Observable<Array<Role>>{
    //über pipe mehrer methoden aneinander hängen, soll 3 mal wiederholt werden bei error
    return this.http.get<Array<Role>>(`${this.api}/roles`).pipe(retry(3)).pipe(catchError(this.errorHandler));
  }

  //gibt einzelnes Padlet anhand von ID zurück
  getSingle(id: number):Observable<Padlet>{
    return this.http.get<Padlet>(`${this.api}/padlets/${id}`).pipe(retry(3)).pipe(catchError(this.errorHandler));
  }

  //gibt einzelnen Entry anhand von ID zurück
  getSingleEntry(entryid: number):Observable<Entry>{
    return this.http.get<Entry>(`${this.api}/entries/${entryid}`).pipe(retry(3)).pipe(catchError(this.errorHandler));
  }

  getSinlgeUser(userid:number):Observable<User>{
    return this.http.get<User>(`${this.api}/users/${userid}`).pipe(retry(3)).pipe(catchError(this.errorHandler));
  }

  getSinglePadletUser(padletid:number):Observable<any>{
    return this.http.get<any>(`${this.api}/userRoles/${padletid}`).pipe(retry(3)).pipe(catchError(this.errorHandler));
  }

  getAllSearch(searchTerm:string):Observable<Array<Padlet>>{
    return this.http.get<Padlet>(`${this.api}/padlets/search/${searchTerm}`).pipe(retry(3)).pipe(catchError(this.errorHandler));
  }

  getUserRole():Observable<Array<any>>{
    return this.http.get<any>(`${this.api}/userRoles`).pipe(retry(3)).pipe(catchError(this.errorHandler));
  }




  private errorHandler(error: Error | any): Observable<any>{
    return throwError(error);
  }
}
