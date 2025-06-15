import { Component, computed, inject } from '@angular/core';
import { Product } from '../../services/product/product';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-my-cart',
  imports: [NgIf],
  templateUrl: './my-cart.html',
  styleUrl: './my-cart.css'
})
export class MyCart {
  subTotal=computed(() =>
     this.productService.cartItems().reduce((total, item) => total + item.productId.price * item.quantity, 0)
);

  deliveryFee=computed(() => this.subTotal() * 0.1);
  allCartItems = computed(() => this.productService.cartItems());
  total = computed(() => this.subTotal() + this.deliveryFee());

  productService=inject(Product)
  ngOnInit(){
    this.productService.getCartItemsByUserId().subscribe(()=>{
         
    },(error)=>{
      console.log(error)
    })

  }


  deleteCartItemById(id:string){
    console.log(id)
    this.productService.deleteCartItem(id).subscribe((res:any)=>{
      console.log(res)
      this.productService.clearCart()
      this.productService.getCartItemsByUserId().subscribe((res:any)=>{
       console.log("deleting product")
      },(error)=>{
        console.log(error)
      })
    })
  }

  clearCart(){
    this.productService.clearAllCartItems().subscribe((res:any)=>{
      this.productService.clearCart()
      this.productService.getCartItemsByUserId().subscribe((res:any)=>{
       console.log("deleting product")
      },(error)=>{
        console.log(error)
      })
    })
  }
}
