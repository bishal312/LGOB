import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Header } from "../../user/home/header/header";
import { Footer } from "../../footer/footer/footer";
import { Auth } from '../../services/auth/auth';
import { error } from 'console';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, Header, Footer],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css'
})
export class MainLayout {

}
