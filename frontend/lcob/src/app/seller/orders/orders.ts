import { Component, inject } from '@angular/core';
import { Order } from '../../services/order/order';
import { NgClass, NgIf } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-orders',
  imports: [NgIf,NgClass,RouterOutlet],
  templateUrl: './orders.html',
  styleUrl: './orders.css'
})
export class Orders {
 
  router=inject(Router)
  orderService=inject(Order)
  allOrders:any[]=[]
  filteredOrders:any[]=[]
  currentFilter:string='all'
  

  ngOnInit(){
    this.getAllOrders()
  }

  getAllOrders(){
    this.orderService.getAllOrders().subscribe((res:any)=>{
      this.allOrders=res.map((order:any)=>{
        
        return {
          ...order,
          
          totalQuantity: this.getTotalQuantity(order)
        }
      })
      this.filterOrders('all')
    },(error)=>{
      console.log(error)
    })
  }

  filterOrders(status:string){
    this.currentFilter=status
    if(status=='all'){
      this.filteredOrders=this.allOrders
    }
    else{
      const filterOrders=this.allOrders.filter((order:any)=>{
        return order.status==status
      })
      this.filteredOrders=filterOrders
    }
  }

  getTotalQuantity(order: any): number {
  return order.items?.reduce((sum: number, item: any) => sum + item.quantity, 0) ?? 0;
}

  navigateToOrderDetails(orderId:string){
    this.router.navigate(['/seller/orders/order-detail',orderId])
  }

  getSlicedAddress(address:string){

    if (!address) return 'N/A';

  if (address.length <= 20) return address;

  const words = address.split(' ');
  let result = '';

  for (const word of words) {
    if ((result + word).length > 20) break;
    result += (result ? ' ' : '') + word;
  }

  return result + '...';
  }

  changeOrderStatus(orderId:string,status:string){
    this.orderService.changeOrderStatus(orderId,status).subscribe((res:any)=>{
      this.getAllOrders()
      this.filterOrders(this.currentFilter)
    },(error)=>{
      console.log(error)
    })
  }
}
