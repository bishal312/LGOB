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
  this.router.navigate(['/shop/product', productId]);
  window.scrollTo({ top: 0, behavior: 'smooth' });
  this.getProductDetail(productId);
}

 addToCart(){
  const product=this.productDetail
  
  console.log("adding to cart handler")
  this.productService.addToCart(product!._id,this.quantity()).subscribe((res:any)=>{
    console.log("adding to cart")
    this.productService.clearCart()
    this.productService.getCartItemsByUserId().subscribe()

  },(error)=>{
    console.log(error,"error")
  })
}

}
