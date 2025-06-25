import { Component, inject, signal } from '@angular/core';
import { Order } from '../../services/order/order';
import { Product } from '../../services/product/product';
import { IproductGetObj } from '../../models/model';
import { AsyncPipe, CommonModule,  DatePipe, NgIf } from '@angular/common';
import { MatSnackBarModule} from '@angular/material/snack-bar';
import { PopupService } from '../../services/popup/popup-service';
import { DialogBox } from '../../services/dialog/dialog-box';
import { Loader } from '../../mat-services/loader/loader';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoadingComponent } from "../../services/loading-component/loading-component/loading-component";
@Component({
  selector: 'app-myorders',
  imports: [DatePipe, NgIf, CommonModule, MatSnackBarModule,AsyncPipe, MatProgressSpinnerModule, LoadingComponent],
  templateUrl: './myorders.html',
  styleUrl: './myorders.css',
})
export class Myorders {
  orderService = inject(Order);
  productService = inject(Product);
  snackbar=inject(PopupService)
  dialogBox=inject(DialogBox)
  loaderService=inject(Loader)
  loader=signal<boolean>(false)

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

          this.snackbar.show(res.message,"close",3000,'left','top',['snackbar-below-navbar'])
          this.messageToUser = res.message;
          this.orderItems = [];
        }
        if (res.message === 'Your Orders:-') {

          this.orderItems = res.onlyItems.map((order: any) => ({
            orderId: order.orderId,
            createdAt: order.createdAt,
            totalAmount: order.totalAmount,
            items: order.items,
          }));
          this.orderItems.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
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
        if(res.message === "Order cancelled successfully"){
          this.snackbar.show('Order Cancelled successfully',"close",
           3000,
           'center',
           'top',
           ['snackbar']
           )
        }
        this.getOrderDetail();
      },
      error: (error) => {
        console.log(error, 'error while canceling order');
      },
    });
  }
}
