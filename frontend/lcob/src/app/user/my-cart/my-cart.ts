import { Component, computed, inject } from '@angular/core';
import { Product } from '../../services/product/product';
import { NgIf } from '@angular/common';
import { FormControl, FormGroup } from '@angular/forms';
import { OrderItem } from '../../models/model';
import { Order } from '../../services/order/order';
import { error } from 'console';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-my-cart',
  imports: [NgIf,RouterLink],
  templateUrl: './my-cart.html',
  styleUrl: './my-cart.css',
})
export class MyCart {
  
  showPopup:boolean = false;
  checkoutMessage: string = '';
  
   orderFormObj:FormGroup= new FormGroup({
    items:new FormControl([]),
    totalAmount:new FormControl(0),
    address:new FormControl('Golpark, Butwal, Lumbini Province, Nepal'),
    location:new FormGroup({
      latitude:new FormControl(27.6959),
      longitude:new FormControl(83.4509)
    })
  })

  subTotal = computed(() =>
    this.productService
      .cartItems()
      .reduce((total, item) => total + item.productId.price * item.quantity, 0)
  );

  deliveryFee = computed(() => this.subTotal() * 0.1);
  allCartItems = computed(() => this.productService.cartItems());
  total = computed(() => this.subTotal() + this.deliveryFee());
  
  router=inject(Router)
  orderService=inject(Order)
  productService = inject(Product);
  ngOnInit() {
    this.productService.getCartItemsByUserId().subscribe(
      () => {},
      (error) => {
        console.log(error);
      }
    );
  }

  deleteCartItemById(id: string) {
    
    this.productService.deleteCartItem(id).subscribe((res: any) => {
      
      this.productService.clearCart();
      this.productService.getCartItemsByUserId().subscribe(
        (res: any) => {
          
        },
        (error) => {
          console.log(error);
        }
      );
    });
  }

  clearCart() {
    this.productService.clearAllCartItems().subscribe((res: any) => {
      this.productService.clearCart();
      this.productService.getCartItemsByUserId().subscribe(
        (res: any) => {
          console.log('deleting product');
        },
        (error) => {
          console.log(error);
        }
      );
    });
  }

  checkoutProcess(){
    this.orderFormObj.controls['totalAmount'].setValue(this.total())
    const totalItems:OrderItem[]=[]
    for(let item of this.allCartItems()){
      
      const newItem:OrderItem={
        productId:item.productId._id,
        quantity:item.quantity
      }
      totalItems.push(newItem)
    }
    this.orderFormObj.controls['items'].setValue(totalItems)

    console.log(this.orderFormObj.value)
    this.orderService.placeOrder(this.orderFormObj.value).subscribe((res:any)=>{
      
      if(res.message === 'Order placed successfully'){
        this.showPopup=true
        this.checkoutMessage=res.message
        setTimeout(() => {
          this.showPopup=false;
          this.router.navigate(['/shop/my-orders']);          
          this.checkoutMessage='';
          this.clearCart()
        })
      }
    },(error)=>{
      this.showPopup=true
      this.checkoutMessage=error.message
      setTimeout(() => {
        this.showPopup=false;
        this.checkoutMessage='';
      })
    })
  }
}
