import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IproductGetObj } from '../../models/model';
import { Product } from '../../services/product/product';
import { Portal } from '@angular/cdk/portal';
import { PopupService } from '../../services/popup/popup-service';
import { NgClass, NgIf } from '@angular/common';



@Component({
  selector: 'app-product-ui',
  imports: [NgClass,NgIf],
  templateUrl: './product.html',
  styleUrl: './product.css'
})
export class ProductUi implements OnInit{
  
  showToast:boolean=false
  toastMessage:string=''
  showOrderForm:boolean=false
  router=inject(Router)
  quantity=signal(1)
  relatedProducts:IproductGetObj[]=[]
  productDetail:IproductGetObj | null = null

  productService=inject(Product)
  popup=inject(PopupService)
  constructor(private route: ActivatedRoute) { }

  productId: string = '';
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.productId = params.get('id')!;
    this.getProductDetail(this.productId);
  });

  this.productService.getProductUser().subscribe(
    (res: any) => {
      this.relatedProducts = res.products;
    },
    error => {
      console.log(error);
    }
  );
  }
  

  getProductDetail(id:string){
    
    this.productService.getProductDetailById(id).subscribe((res:{success:boolean,product:IproductGetObj})=>{
      this.productDetail=res.product
    },
    error=>{console.log(error)})

  }

quantityHandler(action: string) {
  if (action === '-') {
    if (this.quantity() > 1) {
      this.quantity.set(this.quantity() - 1);
    }
  } else {
    this.quantity.set(this.quantity() + 1);
  }
}

navigateToProductDetails(productId: string) {
  this.quantity.set(1);
  this.router.navigate(['/shop/product', productId]);
  window.scrollTo({ top: 0, behavior: 'smooth' });
  this.getProductDetail(productId);
}

 addToCart(){
  const product=this.productDetail
  
 
  this.productService.addToCart(product!._id,this.quantity()).subscribe((res:any)=>{

      if(res.message === 'Added to cart'){
      this.popup.show(res.message,'close',3000,'center','top',['snackbar'])
      this.toastMessage="Product added to cart"
      this.productService.clearCart()
      this.productService.getCartItemsByUserId().subscribe()
     
    }

  },(error)=>{
    this.toastMessage="The item is already in cart"
    this.popup.show(error.error?.message,'close',3000,'center','top',['snackbar'])
  })
}

navigateToCheckout(id?:string) {
  
  this.router.navigate(['/shop/checkout',id],{
    queryParams:{quantity: this.quantity()}
  });
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

}
