import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Order {
  
  apiUrl:string="http://localhost:5001/api/orders"
  constructor(private http:HttpClient) { }

  // for user

  placeOrder(obj:Order){
    return this.http.post(`${this.apiUrl}/place`,obj)
  }

    getOrderDetailByUserId(){
    return this.http.get(`${this.apiUrl}/getmyorders`)
  }

   cancelOrder(id:string){
     return this.http.delete(`${this.apiUrl}/cancelorder/${id}`)
   }


  // for seller dashboard

  getAllOrders(){
    return this.http.get(`http://localhost:5001/api/dashboard/orders`)
  }

  getOrderDetailById(orderid:string){
    return this.http.get(`http://localhost:5001/api/dashboard/orders/${orderid}`)
  }



  changeOrderStatus(id:string,status:string){
    return this.http.patch(`http://localhost:5001/api/dashboard/orders/${id}/status`,{status:status})
  }
}
