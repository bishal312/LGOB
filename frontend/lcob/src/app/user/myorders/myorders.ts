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
  messageToUser: string = '';

  ngOnInit() {
    this.getOrderDetail();
  }

  getOrderDetail() {
    this.orderService.getOrderDetailByUserId().subscribe(
      (res: any) => {
        if (res.message === "You haven't ordered any items yet!") {
          this.messageToUser = res.message;
          this.orderItems = [];
        }
        if (res.message === 'Your Orders:-') {
          this.orderItems = res.onlyItems.map((order: any) => ({
            orderId: order.orderId,
            createdAt: order.createdAt,
            items: order.items,
          }));
          this.getAllProducts();
        }
      },
      (error) => {
        this.messageToUser = error.error?.message;
        console.log(error.error?.message);
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

  cancelOrder(orderId: string) {
    this.orderService.cancelOrder(orderId).subscribe({
      next: (res: any) => {
        console.log(res, 'order canceled');
        this.getOrderDetail();
      },
      error: (error) => {
        console.log(error, 'error while canceling order');
      },
    });
  }
}
