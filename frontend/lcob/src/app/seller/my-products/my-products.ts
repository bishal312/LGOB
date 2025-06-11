import { NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Api } from '../../services/api/api';
import { error } from 'console';

@Component({
  selector: 'app-my-products',
  standalone: true,
  imports: [NgIf,ReactiveFormsModule],
  templateUrl: './my-products.html',
  styleUrl: './my-products.css'
})
export class MyProducts {

  apiService=inject(Api)


  showForm = false;
  
  imageBase64: string = '';

  productObj: FormGroup = new FormGroup({});
  selectedImageFile: File | null = null;

  ngOnInit(): void {
    this.initializeProductObj();
  }

  initializeProductObj() {
    this.productObj = new FormGroup({
      name: new FormControl('', [
        Validators.required,
        Validators.pattern('^[A-Z][a-zA-Z ]+$') // Starts with uppercase
      ]),
      price: new FormControl(0, [
        Validators.required,
        Validators.min(0)
      ]),
      stock: new FormControl(0, [
        Validators.required,
        Validators.min(0)
      ]),
      image: new FormControl('', [
        Validators.required
      ]),
      description: new FormControl('', [
        Validators.required,
        Validators.minLength(10)
      ])
    });
  }

 onFileSelect(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    this.selectedImageFile = file;
    this.productObj.patchValue({ image: file.name }); // for validation
    this.productObj.get('image')?.updateValueAndValidity();

    const reader = new FileReader();
    reader.onload = () => {
      this.imageBase64 = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
}


  addProduct() {
  if (this.productObj.invalid || !this.imageBase64) {
    this.productObj.markAllAsTouched();
    return;
  }
  const user=localStorage.getItem('user')
  const userData=JSON.parse(user!)

  const payload = {
    ...this.productObj.value,
    image: this.imageBase64,
    userId: userData._id
  };
  console.log(payload)

  // Replace with actual API call services calling
  this.apiService.addProduct(payload).subscribe((res:any)=>{
    this.showForm = false;
    console.log(res)
  },error=>{
    console.log(error)
  })
}

}
