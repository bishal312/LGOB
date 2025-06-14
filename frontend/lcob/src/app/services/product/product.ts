import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { IproductGetObj } from '../../models/model';

@Injectable({
  providedIn: 'root'
})
export class Product {

  dashboardApi:string="http://localhost:5001/api/dashboard"

  private productCache:IproductGetObj[] | null = null
  constructor(private http: HttpClient) { }
  
  getAllProducts(){
    if(this.productCache){
      return of(this.productCache)
    }
    else{
          return this.http.get<IproductGetObj[]>('http://localhost:5001/api/dashboard/products').pipe(
            tap(products => this.productCache = products) //updates the product cache
          )
      
      
    }
  }

  clearCache(){
    this.productCache = null
  }

  updateProduct(productObj:any){
   return this.http.put(`${this.dashboardApi}/products/${productObj._id}`,productObj,{ withCredentials: true })
  }

  getProductDetailById(id:string){
    return this.http.get<{success:boolean,product:IproductGetObj}>(`http://localhost:5001/api/products/${id}`)
  }

}
