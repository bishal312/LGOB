import { NgIf } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-ui',
  imports: [MatDialogModule,NgIf],
  templateUrl: './dialog-ui.html',
  styleUrl: './dialog-ui.css'
})
export class DialogUi {

  
constructor(@Inject(MAT_DIALOG_DATA) public data:{title:string,message:string,showActions?:boolean},
public dialogRef:MatDialogRef<DialogUi> ){}
}
