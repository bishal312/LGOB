import { NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
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
  router=inject(Router)
  
  ngOnInit(){
    this.navigateIfAuthenticated()
    this.productService.getProductUser().subscribe((res:any)=>{
      this.allProducts=res.products
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

navigateIfAuthenticated(){
  const user = JSON.parse(localStorage.getItem('user') ?? '{}');
  if (!user) {
  this.router.navigate(['/home']);
}
else if(user.role === 'customer'){
  this.router.navigate(['/home']);
}
else if(user.role === 'admin'){
  this.router.navigate(['/seller/dashboard']);
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
