import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Order {
  
 
  constructor(private http:HttpClient) { }

  // for user

  placeOrder(obj:Order){
    return this.http.post(`${environment.apiUrl}/orders/place`,obj)
  }

    getOrderDetailByUserId(){
    return this.http.get(`${environment.apiUrl}/orders/getmyorders`)
  }

   cancelOrder(id:string){
     return this.http.delete(`${environment.apiUrl}/orders/cancelorder/${id}`)
   }


  // for seller dashboard

  getAllOrders(){
    return this.http.get(`${environment.apiUrl}/dashboard/orders`)
  }

  getOrderDetailById(orderid:string){
    return this.http.get(`${environment.apiUrl}/dashboard/orders/${orderid}`)
  }



  changeOrderStatus(id:string,status:string){
    return this.http.patch(`${environment.apiUrl}/dashboard/orders/${id}/status`,{status:status})
  }
}
