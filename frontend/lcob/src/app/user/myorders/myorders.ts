import { Component, inject } from '@angular/core';
import { Order } from '../../services/order/order';
import { Product } from '../../services/product/product';
import { filter } from 'rxjs';
import { IproductGetObj } from '../../models/model';
import { CommonModule, CurrencyPipe, DatePipe, NgIf } from '@angular/common';
import { error } from 'console';

@Component({
  selector: 'app-myorders',
  imports: [DatePipe, NgIf, CommonModule],
  templateUrl: './myorders.html',
  styleUrl: './myorders.css',
})
export class Myorders {
  orderService = inject(Order);
  productService = inject(Product);

  allProducts: IproductGetObj[] = [];
  orderItems: any[] = [];

  ngOnInit() {
    this.getOrderDetail();
  }

  getOrderDetail() {
    this.orderService.getOrderDetailByUserId().subscribe(
      (res: any) => {
        if (res.message === 'Your Orders:-') {
          this.orderItems = res.onlyItems.map((order: any) => ({
            orderId: order.orderId,
            createdAt: order.createdAt,
            items: order.items,
          }));
          console.log(this.orderItems);
          this.getAllProducts();
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getAllProducts() {
    this.productService.getProductUser().subscribe(
      (res: any) => {
        this.allProducts = res.products;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getProductById(productId: string) {
    return this.allProducts.find((p) => p._id === productId);
  }

  getTotalAmount(order: { items: any[] }): number {
    return order.items.reduce((total, item) => {
      const product = this.getProductById(item.productId);
      return total + (product?.price ?? 0) * item.quantity;
    }, 0);
  }

  cancelOrder(orderId:string){
    console.log(orderId,"order id");
    this.orderService.cancelOrder(orderId).subscribe({
      next:(res:any)=>{
        this.getOrderDetail()
      },
      error:(error)=>{
        console.log(error,"error while canceling order");
      }
    })
  }
}
