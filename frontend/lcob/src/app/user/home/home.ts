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
   
  showToast = false;
  toastMessage:string='';
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
  const user = localStorage.getItem('user');
  if (!user) {
  alert('Please log in to add items to your cart.');
  
  return;
  }
  this.productService.addToCart(product._id).subscribe((res:any)=>{
    if(res){
      this.showToast=true
      this.toastMessage="Product added to cart"
      this.productService.clearCart()
      this.productService.getCartItemsByUserId().subscribe()
      setTimeout(() => {
        this.showToast=false
        this.toastMessage='';
      }, 2000);
    }

  },(error)=>{
    this.showToast=true
    this.toastMessage="The item is already in cart"
    setTimeout(() => {
      this.showToast=false
      this.toastMessage='';
    }, 2000);
  })
}
}
