import { NgIf } from '@angular/common';
import { Component,  computed,  effect, inject, Renderer2, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Api } from '../../services/api/api';
import { Product } from '../../services/product/product';
import { IproductGetObj } from '../../models/model';
import { sign } from 'crypto';

@Component({
  selector: 'app-my-products',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule],
  templateUrl: './my-products.html',
  styleUrl: './my-products.css'
})
export class MyProducts {
  productService = inject(Product);
  apiService = inject(Api);
  renderer = inject(Renderer2);

  readonly product = computed(() => this.productService.products());
  showForm = false;
  isEditing:boolean=false;
  imageBase64: string = '';
  editingProductId: string = '';
  productObj: FormGroup = new FormGroup({});
  selectedImageFile: File | null = null;

  ngOnInit() {
    this.productService.clearCache();
    this.loadProducts();
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

    const user = localStorage.getItem('user');
    const userData = JSON.parse(user!);

    const payload = {
      ...this.productObj.value,
      image: this.imageBase64,
      userId: userData._id
    };

    this.apiService.addProduct(payload).subscribe(
      (res: any) => {
        this.productService.clearCache();
        this.loadProducts();

        // Add JSON-LD script for the newly added product
        this.addJsonLd({
          ...payload,
          _id: res._id ?? 'new-product-id' // fallback id if not returned
        });
      },
      (error) => {
        console.log(error);
      }
    );
    this.showForm = false;
  }

  loadProducts() {
this.productService.getAllProducts().subscribe({
  next: (products) => {
    console.log('Products:', products);
  },
  error: (err) => {
    console.error('Error loading products:', err);
  }
});
  }

  addJsonLd(product: any) {
    const jsonLd = {
      "@context": "https://schema.org/",
      "@type": "Product",
      "name": product.name,
      "image": product.image,
      "description": product.description,
      "sku": product._id,
      "offers": {
        "@type": "Offer",
        "priceCurrency": "USD",
        "price": product.price,
        "availability": "https://schema.org/InStock"
      }
    };

    const script = this.renderer.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(jsonLd);
    this.renderer.appendChild(document.head, script);
  }

  editProduct(product:IproductGetObj){
    console.log(product)
    this.editingProductId=product._id
    this.productObj.patchValue(product)
    this.isEditing=true

    this.showForm=true
  }

  updateProduct(){
   
    
    this.showForm=false
    this.isEditing=false
      const payload = {
      ...this.productObj.value,
      image: this.imageBase64,
      _id:this.editingProductId
      
    };
    // run load again due to update in products
    this.productService.updateProduct(payload).subscribe((res:any)=>{
      if(res){
        this.productService.clearCache()
        this.loadProducts();
      }
     
    },(error)=>{
      console.log(error)
    })
  }

  
}
