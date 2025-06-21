import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { IuserSignupObj, SellerLogin } from '../../models/model';
import { map, of } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Auth {

  



  constructor(private http:HttpClient) { }

  

  getAdmin(){
    return this.http.get<any>(`${environment.apiUrl}/auth/secureadmin`)
  }

   

  login(obj:any){
    return this.http.post(`${environment.apiUrl}/auth/login`,obj)
  }

  //refresh token api
  refreshAccessToken() {
  return this.http.post(`${environment.apiUrl}/auth/refresh-token`,{}, {
    withCredentials:true
  })
 

}

  logout(){
    localStorage.removeItem('user');
  }
}
