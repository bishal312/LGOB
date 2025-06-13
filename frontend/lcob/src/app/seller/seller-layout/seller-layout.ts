import { NgClass, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-seller-layout',
  imports: [RouterOutlet,RouterLink,RouterLinkActive,NgIf,NgClass],
  templateUrl: './seller-layout.html',
  styleUrl: './seller-layout.css'
})
export class SellerLayout {
    sidebarOpen = false;

    logout(){
      localStorage.removeItem('user');
    }

}
