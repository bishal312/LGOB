import { inject, Injectable } from '@angular/core';
import { MatDialog, MatDialogState } from '@angular/material/dialog';
import { DialogUi } from './dialog-ui/dialog-ui';

@Injectable({
  providedIn: 'root'
})
export class DialogBox {
  private dialog=inject(MatDialog)
  constructor() { }
  
  open(message:string,title:string='Alert'){
   return this.dialog.open(DialogUi,{
      width:'400px',
      data:{
        title,
        message
      }
    }).afterClosed();  //retrun observable
  }

  openWithoutContinue(message: string, title: string = 'Alert', duration: number = 1500, showActions: boolean = true) {
  const dialogRef = this.dialog.open(DialogUi, {
    width: '400px',
    data: { title, message, showActions },
  });

  // Auto-close after `duration` ms
  setTimeout(() => {
    if (dialogRef.getState() === MatDialogState.OPEN) {
      dialogRef.close();
    }
  }, duration);

  return dialogRef.afterClosed();
}
}
