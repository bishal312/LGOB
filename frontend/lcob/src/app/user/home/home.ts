import { NgIf } from '@angular/common';
import { Component } from '@angular/core';


@Component({
  selector: 'app-home',
  imports: [NgIf],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
   
  message:string=""
   
subscribe(email:string){
  if (email.includes('@')) {
      // Simulate sending email to API
      this.message = `Subscribed successfully with: ${email}`;
    } else {
      this.message = 'Please enter a valid email address.';
    }
}

}
