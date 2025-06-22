import { isPlatformBrowser, NgIf } from '@angular/common';
import { Component, computed, Inject, inject, PLATFORM_ID, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../../services/auth/auth';
import { Product } from '../../../services/product/product';
import {  IproductGetObj } from '../../../models/model';
import { sign } from 'crypto';



@Component({
  selector: 'app-header',
  imports: [RouterLink,NgIf],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
  
  searchTerm = signal('');
  isMenuOpen = signal(false);
  allCartItems=signal<IproductGetObj[]>([])
  cartcount=computed(() => this.productService.cartItems().length)
    constructor(@Inject(PLATFORM_ID) private platformId: Object) { }
   authService=inject(Auth)
   productService=inject(Product)
    ngOnInit(){
     if (isPlatformBrowser(this.platformId)) {
    if (this.btnText() === "Login") {
      const userData = localStorage.getItem('user');
      if (userData !== null) {
        this.btnText.set("Logout");
      }
    }
  }
  this.productService.clearCart()
  this.productService.getCartItemsByUserId().subscribe(
    ()=>{
    
     
    },(error)=>{
      console.log(error)
    }
  )
  

    }

    


  
  toggleMenu(): void {
    if(this.isMenuOpen()){
      this.isMenuOpen.set(false);
    }
    else{
      this.isMenuOpen.set(true);
    }
  }

  
 router=inject(Router)
 btnText=signal('Login');

 onLogin(text:string){
   if(text == "Login"){
    
     
     this.router.navigate(['/signup'])
   }
   else{
     this.router.navigate(['/home'])
     this.btnText.set("Login");
     this.authService.logout();
     
   }
 }




}
