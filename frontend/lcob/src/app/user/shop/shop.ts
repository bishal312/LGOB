import { Component, inject, OnInit } from '@angular/core';
import { Product } from '../../services/product/product';
import { IproductGetObj } from '../../models/model';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';


@Component({
  selector: 'app-shop',
  imports: [NgIf],
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
      
      this.productService.getProductUser().subscribe((res:any)=>
       { 
         this.getAllProductsCount++
         this.getProductCount=res.products?.length
         this.allProducts=res.products
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
