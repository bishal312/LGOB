import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IuserSignupObj } from '../../models/model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Api {

  api:string="http://localhost:5001/api/auth"

  constructor(private http:HttpClient) { }
  
  //signup are here and login in auth
  userSignup(obj:IuserSignupObj):Observable<IuserSignupObj>{
    return this.http.post<IuserSignupObj>(`${this.api}/signup`,obj)
  }

  adminSignup(obj:IuserSignupObj){
    return this.http.post(`${this.api}/signup`,obj)
  }
}
