import { NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '../../services/product/product';
import { IproductGetObj } from '../../models/model';
import { error } from 'console';


@Component({
  selector: 'app-home',
  imports: [NgIf,RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
   
  allProducts:IproductGetObj[]=[]
  
  productService=inject(Product)
  
  ngOnInit(){
    this.productService.getAllProducts().subscribe((res:IproductGetObj[])=>{
      this.allProducts=res
    }
    , error=>{console.log(error)})
  }
  message:string=""
   
subscribe(email:string){
  if (email.includes('@')) {
      // Simulate sending email to API
      this.message = `Subscribed successfully with: ${email}`;
    } else {
      this.message = 'Please enter a valid email address.';
    }
}


addToCart(product:IproductGetObj){
  this.productService.addToCart(product._id).subscribe((res:any)=>{
    console.log(res)
    this.productService.clearCart()
    this.productService.getCartItemsByUserId().subscribe()

  },(error)=>{
    console.log(error,"error")
  })
}
}
