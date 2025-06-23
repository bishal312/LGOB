import { inject, Injectable } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class PopupService {
  popup = inject(MatSnackBar);
  constructor() {}

  show(
    message: string,
    action: string = 'close',
    duration: number = 3000,
    horizontalPosition: MatSnackBarHorizontalPosition = 'center',
    verticalPosition: MatSnackBarVerticalPosition = 'top',
    panelClass: string[] = ['snackbar']
  ) {
    this.popup.open(message, action, {
      duration,
      horizontalPosition,
      verticalPosition,
      panelClass,
    });
  }
}
