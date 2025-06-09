import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IuserSignupObj, SellerLogin } from '../../models/model';

@Injectable({
  providedIn: 'root'
})
export class Auth {

  api:string="http://localhost:5001/api/auth"

  constructor(private http:HttpClient) { }

  

  getAdmin(){
    return this.http.get<any>(`${this.api}/secureadmin`)
  }

   

  login(obj:any){
    return this.http.post(`${this.api}/login`,obj)
  }
}
