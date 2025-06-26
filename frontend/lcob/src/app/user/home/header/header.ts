import { isPlatformBrowser, NgClass, NgIf } from '@angular/common';
import { Component, computed, Inject, inject, PLATFORM_ID, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../../services/auth/auth';
import { Product } from '../../../services/product/product';
import {  IproductGetObj } from '../../../models/model';



@Component({
  selector: 'app-header',
  imports: [RouterLink,NgIf,NgClass],
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
       const userData = localStorage.getItem('user');
    if (this.btnText() === "Login") {
      if (userData !== null) {
        this.btnText.set("Logout");
      }
    }
    if(userData !== null){
      this.productService.clearCart()
      this.productService.getCartItemsByUserId().subscribe(
        ()=>{
        
         
        },(error)=>{
          console.log(error)
        }
      )
      
    }

  }
  

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
