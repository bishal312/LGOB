import { inject, Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
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
}
