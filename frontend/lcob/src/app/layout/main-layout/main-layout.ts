import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Header } from "../../user/home/header/header";
import { Footer } from "../../footer/footer/footer";
import * as AOS from 'aos';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, Header, Footer],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css'
})
export class MainLayout {

  ngOnInit() {
    AOS.init({
      duration: 1000,
      once:false
    })
  }

  ngAfterViewInit() {
    AOS.refreshHard()
  }
}
