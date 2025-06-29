import { AsyncPipe, NgClass, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Product } from '../../services/product/product';
import { IproductGetObj } from '../../models/model';
import { Loader } from '../../mat-services/loader/loader';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { PopupService } from '../../services/popup/popup-service';

@Component({
  selector: 'app-home',
  imports: [NgIf, RouterLink,MatProgressSpinnerModule, AsyncPipe,NgClass],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
   
  showToast = false;
  toastMessage:string='';
  allProducts:IproductGetObj[]=[]
  loaderService=inject(Loader)
  popup=inject(PopupService)
  
  productService=inject(Product)
  router=inject(Router)
  
  ngOnInit(){
    this.navigateIfAuthenticated()
    this.productService.getProductUser().subscribe((res:any)=>{
      const allProducts=res.products.filter((p:any)=>p.isFeatured === true)
      this.allProducts=allProducts.slice(0,3)
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
    if(res.message === 'Added to cart'){
      this.popup.show(res.message,'close',3000,'center','top',['snackbar'])
      this.toastMessage="Product added to cart"
      this.productService.clearCart()
      this.productService.getCartItemsByUserId().subscribe()
    
     
    }

  },(error)=>{
    this.toastMessage="The item is already in cart"
    this.popup.show(this.toastMessage,'close',3000,'center','top',['snackbar'])
  })
}
}
