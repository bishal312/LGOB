import { Component, computed, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { Product } from '../../services/product/product';

import { ActivatedRoute, Router } from '@angular/router';
import { IproductGetObj, OrderItem } from '../../models/model';
import { FormControl, FormGroup } from '@angular/forms';
import { sign } from 'crypto';
import { Order } from '../../services/order/order';


@Component({
  selector: 'app-checkout',
  imports: [],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css'
})
export class Checkout implements OnInit{

  orderFormObj:FormGroup= new FormGroup({
    items:new FormControl([]),
    totalAmount:new FormControl(0),
    address:new FormControl('Golpark, Butwal, Lumbini Province, Nepal'),
    location:new FormGroup({
      latitude:new FormControl(27.6959),
      longitude:new FormControl(83.4509)
    })
  })
  
  quantity=signal(1)
  name:string='';
  phonenumber:string='';
  showPopup:boolean=false


  productDetail=signal<IproductGetObj | null>(null)
  totalAmount=computed(() => (this.productDetail()?.price ?? 0)* this.quantity());
  deliveryFee=computed(() => this.totalAmount() * 0.1);
  totalOrder=computed(() => this.totalAmount() + this.deliveryFee());
 
  @ViewChild('autocomplete',{static: false})autocompleteRef!: ElementRef<HTMLInputElement>;
  
  autocomplete: google.maps.places.Autocomplete | undefined;

  constructor (private route:ActivatedRoute){}
  
  productId: string = '';
  checkoutMessage: string = '';

  
  router=inject(Router)
  productService = inject(Product);
  orderService=inject(Order)
  ngOnInit() {
  
    this.bindUserDetail()

    this.productId=this.route.snapshot.params['id'];
    const quantity=this.route.snapshot.queryParamMap.get('quantity');
    if(quantity){
      this.quantity.set(Number(quantity));
    }
    
    this.productService.getProductDetailById(this.productId).subscribe(
      (res:{success:boolean,product:IproductGetObj})=>
        {
          this.productDetail.set(res.product)
          
         
        }
    )

  

  }
 

  
  bindUserDetail(){
   
    const user= localStorage.getItem('user');
    if(user){
      const userData=JSON.parse(user);
      this.name=userData.fullName;
     
      this.phonenumber=userData.phoneNumber;
     
    }
    else{
      return
    }
  }
  
   checkoutProcess(){
    this.orderFormObj.controls['totalAmount'].setValue(this.totalOrder());
    const newItem:OrderItem={
      productId: this.productId,
      quantity: this.quantity()
    }

    this.orderFormObj.controls['items'].setValue([newItem]);
    const value=this.orderFormObj.value;
     

    
    this.orderService.placeOrder(value).subscribe((res:any)=>{
      this.showPopup=true
      if(res.message === 'Order placed successfully'){
        this.checkoutMessage=res.message
        setTimeout(() => {
          this.showPopup=false;
          this.router.navigate(['/shop/my-orders']);          
          this.checkoutMessage='';
        }, 2000);
      }
    },(error)=>{
      console.log("error while placing order",error)
      this.showPopup=true
      this.checkoutMessage=error.message
      setTimeout(() => {
        this.showPopup=false;
        this.checkoutMessage='';
      })
    })

   }
 
}
