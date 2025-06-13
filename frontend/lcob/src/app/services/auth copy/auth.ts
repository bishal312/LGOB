import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { IuserSignupObj, SellerLogin } from '../../models/model';
import { map, of } from 'rxjs';

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

  //refresh token api
  refreshAccessToken() {
  return this.http.post(`${this.api}/refresh-token`,{}, {
    withCredentials:true
  })
 

}

  logout(){
    localStorage.removeItem('user');
  }
}
