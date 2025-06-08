import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {


  
 router=inject(Router)
 btnText=signal('Login');

 onLogin(text:string){
   if(text == "Login"){
    
     
     this.router.navigate(['/signup'])
   }
 }




}
