import { NgFor, NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../../services/product/product';
import { Order } from '../../services/order/order';

@Component({
  selector: 'app-order-detail',
  imports: [NgIf,NgFor],
  templateUrl: './order-detail.html',
  styleUrl: './order-detail.css'
})
export class OrderDetail implements OnInit {
  order:any;
  isVisible = false;
  router=inject(Router)
  productService=inject(Product)
  orderService=inject(Order)

  orderProductsDetails:any[]=[]

  constructor (private route: ActivatedRoute){}

  ngOnInit(): void {
      
      const orderId=this.route.snapshot.paramMap.get('id')
      
     if(orderId){
       this.orderService.getOrderDetailById(orderId).subscribe((res:any)=>{

        this.order=res
        this.getProductsDetail()
      })
     }
  }
  backToAllOrders(){
       this.router.navigate(['/seller/orders'])
  }

  getProductsDetail(){
    const ids=this.order.items.map((product:any)=>product.productId)
    ids.forEach((id:string)=>{
      this.productService.getProductDetailById(id).subscribe((res:any)=>{this.orderProductsDetails.push(res)})
    })
  }

  

}
