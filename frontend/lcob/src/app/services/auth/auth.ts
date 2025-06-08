import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SellerLogin } from '../../models/model';

@Injectable({
  providedIn: 'root'
})
export class Auth {

  api:string="http://localhost:5001/api/auth"

  constructor(private http:HttpClient) { }

  checkSellerCount(obj:SellerLogin){
    console.log("checkSellerCount auth")
    return this.http.post(`${this.api}/signup`,obj)
  }
}
