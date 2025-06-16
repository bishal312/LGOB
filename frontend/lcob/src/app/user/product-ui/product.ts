import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IproductGetObj } from '../../models/model';
import { Product } from '../../services/product/product';



@Component({
  selector: 'app-product-ui',
  imports: [],
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

  constructor(private route: ActivatedRoute) { }

  productId: string = '';
  ngOnInit(): void {
      this.productId=this.route.snapshot.params['id'];
      this.getProductDetail(this.productId)
      this.productService.getAllProducts().subscribe((res:IproductGetObj[])=>{
        this.relatedProducts=res
      },error=>{console.log(error)})
  }
  

  getProductDetail(id:string){

    this.productService.getProductDetailById(id).subscribe((res:{success:boolean,product:IproductGetObj})=>{
      this.productDetail=res.product
    })

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

      if(res){
      this.showToast=true
      this.toastMessage="Product added to cart"
      this.productService.clearCart()
      this.productService.getCartItemsByUserId().subscribe()
      setTimeout(() => {
        this.showToast=false
        this.toastMessage='';
      }, 2000);
    }

  },(error)=>{
    this.showToast=true
    this.toastMessage="The item is already in cart"
    setTimeout(() => {
      this.showToast=false
      this.toastMessage='';
    }, 2000);
  })
}

navigateToCheckout(id?:string) {
  
  this.router.navigate(['/shop/checkout',id],{
    queryParams:{quantity: this.quantity()}
  });
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

}
