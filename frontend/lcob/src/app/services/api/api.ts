import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IuserSignupObj } from '../../models/model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Api {

  constructor(private http:HttpClient) { }

  userSignup(obj:IuserSignupObj):Observable<IuserSignupObj>{
    return this.http.post<IuserSignupObj>(`http://localhost:5001/api/auth/signup`,obj)
  }
}
