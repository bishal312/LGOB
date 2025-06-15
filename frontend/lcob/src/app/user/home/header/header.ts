import { isPlatformBrowser, NgIf } from '@angular/common';
import { Component, Inject, inject, PLATFORM_ID, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../../services/auth/auth';
import { platform } from 'node:os';
import { single } from 'rxjs';
import { Product } from '../../../services/product/product';
import { IcartObj, IproductGetObj } from '../../../models/model';
import { error } from 'node:console';


@Component({
  selector: 'app-header',
  imports: [RouterLink,NgIf],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
  

  allCartItems=signal<IproductGetObj[]>([])
  cartcount=signal(0)
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

      const cartItems = this.productService.cartItems()
      this.cartcount.set(cartItems.length)
     
    }
  )
  

    }

    isMenuOpen = false;


  
  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
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
