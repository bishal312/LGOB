import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-my-products',
  standalone: true,
  imports: [NgIf,ReactiveFormsModule],
  templateUrl: './my-products.html',
  styleUrl: './my-products.css'
})
export class MyProducts {
  showForm = false;

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
      quantity: new FormControl(0, [
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
      this.productObj.patchValue({ image: file.name }); // For validation
      this.productObj.get('image')?.updateValueAndValidity();
    }
  }

  addProduct() {
    if (this.productObj.invalid || !this.selectedImageFile) {
      this.productObj.markAllAsTouched();
      return;
    }

   const formValues = this.productObj.value;

  const formData = new FormData();
  formData.append('name', formValues.name);
  formData.append('price', formValues.price.toString());
  formData.append('quantity', formValues.quantity.toString());
  formData.append('description', formValues.description);
  formData.append('image', this.selectedImageFile);
    //api call made here
     // Debug: Log the FormData
    formData.forEach((value, key) => {
    console.log(`${key}:`, value);
  });

    // Reset form
    this.productObj.reset();
    this.selectedImageFile = null;
    this.showForm = false;
  }
}
