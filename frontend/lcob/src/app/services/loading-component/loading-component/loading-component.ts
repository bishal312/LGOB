import { Component, inject, Input } from '@angular/core';
import { Loader } from '../../../mat-services/loader/loader';
import { AsyncPipe, NgClass, NgIf } from '@angular/common';

@Component({
  selector: 'app-loading-component',
  imports: [NgIf,AsyncPipe,NgClass],
  templateUrl: './loading-component.html',
  styleUrl: './loading-component.css'
})
export class LoadingComponent {
  @Input() containerClass:string='min-h[300px]';
  loaderService=inject(Loader)
}
