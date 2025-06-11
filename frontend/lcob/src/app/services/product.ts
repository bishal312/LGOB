import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class Product {
  private productCache:any[] | null = null
  constructor(private http: HttpClient) { }
  
  getAllProducts(){
    if(this.productCache){
      return of(this.productCache)
    }
    else{
          return this.http.get<any[]>('http://localhost:5001/api/dashboard/products').pipe(
            tap(products => this.productCache = products) //updates the product cache
          )
      
      
    }
  }

  clearCache(){
    this.productCache = null
  }

}
