import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IuserSignupObj } from '../../models/model';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Api {
  
 


  constructor(private http:HttpClient) { }
  
  //signup are here and login in auth
  userSignup(obj:IuserSignupObj):Observable<IuserSignupObj>{
    console.log(obj)
    return this.http.post<IuserSignupObj>(`${environment.apiUrl}/auth/signup`,obj)
  }

  adminSignup(obj:IuserSignupObj){
    return this.http.post(`${environment.apiUrl}/auth/signup`,obj)
  }

  addProduct(obj:any){
    return this.http.post(`${environment.apiUrl}/dashboard/products`,obj)
  }
}
