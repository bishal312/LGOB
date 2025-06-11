import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IuserSignupObj } from '../../models/model';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Api {
  
  tokenExpired$:Subject<boolean>=new Subject<boolean>()

  api:string="http://localhost:5001/api/auth"

  constructor(private http:HttpClient) { }
  
  //signup are here and login in auth
  userSignup(obj:IuserSignupObj):Observable<IuserSignupObj>{
    return this.http.post<IuserSignupObj>(`${this.api}/signup`,obj)
  }

  adminSignup(obj:IuserSignupObj){
    return this.http.post(`${this.api}/signup`,obj)
  }

  addProduct(obj:any){
    return this.http.post(`http://localhost:5001/api/dashboard/products`,obj)
  }
}
