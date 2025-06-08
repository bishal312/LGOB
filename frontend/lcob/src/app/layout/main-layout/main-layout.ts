import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from "../../user/home/header/header";
import { Footer } from "../../footer/footer/footer";

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, Header, Footer],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css'
})
export class MainLayout {

}
