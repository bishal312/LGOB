import { Component, inject, OnInit } from '@angular/core';
import { Product } from '../../services/product/product';
import { IproductGetObj } from '../../models/model';
import { Router } from '@angular/router';


@Component({
  selector: 'app-shop',
  imports: [],
  templateUrl: './shop.html',
  styleUrl: './shop.css'
})
export class Shop {

  router=inject(Router)

  getAllProductsCount:number=0
  getProductCount:number=0
  allProducts: IproductGetObj[] = [];
  productService=inject(Product)
 ngOnInit(){
    if(this.getAllProductsCount==0){
      
      this.productService.getAllProducts().subscribe((res:IproductGetObj[])=>
       { 
         this.getAllProductsCount++
         this.getProductCount=res.length
         this.allProducts=res
       })
    }
    else{
      console.log("already called");
    }

      

 }

 navigateToProductDetails(productId: string) {
  this.router.navigate(['/shop/product', productId]);
}
}
