import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Order {
  
  apiUrl:string="http://localhost:5001/api/orders"
  constructor(private http:HttpClient) { }

  // place Order

  placeOrder(obj:Order){
    return this.http.post(`${this.apiUrl}/place`,obj)
  }
}
