import {  Component, inject, ViewChild } from '@angular/core';
import { forkJoin } from 'rxjs';
import { Order } from '../../services/order/order';
import { Product } from '../../services/product/product';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {
  //chart js variables
  ctx:any;
  canvas:any;

  @ViewChild('topProductsChart') topProductsChart!: {nativeElement: HTMLCanvasElement};
  piechart:any;
  
  allOrders:any[]=[]
  allProducts:any[]=[]
  top5products:any[]=[]

  orderService=inject(Order)
  productService=inject(Product)

  

  piechartBrowser():void{
      if (this.piechart) {
    this.piechart.destroy(); // clear previous chart
  }
    this.canvas=this.topProductsChart.nativeElement
    this.ctx=this.canvas.getContext('2d')
    this.piechart= new Chart(this.ctx,{
      type:'pie',
      data:{
        labels:this.top5products.map(p=>p.name),
        datasets:[{
          label:'Top 5 products',
          data:this.top5products.map(p=>p.quantity),
          backgroundColor: ['#60a5fa', '#f59e0b', '#10b981', '#f87171', '#a78bfa'],
          borderColor: '#fff',
          borderWidth: 1
        },
      ]
      },
      options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'right'
        }
      }
    }
    })
  }


  ngOnInit(){
    this.loadAllData()
  }
  loadAllData(){
    forkJoin({
      
      orders:this.orderService.getAllOrders(),
      products:this.productService.getAllProducts()
    }).subscribe(
      {
        next:(res:any)=>{
          this.allOrders=res.orders
          this.allProducts=res.products
          console.log(this.allOrders,this.allProducts,"all orders and all products")
          this.getTopProducts()

        }
      }
    )
  }

  getTopProducts(){
    const productCount = new Map<string, number>();
    //entry in map to check the quantity and the product mostly order
    this.allOrders.forEach((order: any) => {
      order.items.forEach((item:any)=>{
        const productId=item.productId
        const quantity=item.quantity
        productCount.set(productId, (productCount.get(productId) ?? 0) + quantity);
      })
    })
     
    const topOrderedProduct= Array.from(productCount.entries()).map(([productId,totalQuantity])=>{
      const product=this.allProducts.find(p => p._id === productId )
      return {
        productId,
        name:product.name,
        image:product.image,
        quantity:totalQuantity
      }
    })
   

    //sort the product in descending order
    topOrderedProduct.sort((a,b)=> b.quantity - a.quantity)
    
    //to get 5 top products
    const top5products=topOrderedProduct.slice(0,5)
    console.log(top5products)
    this.top5products=top5products
    //calling piechart here so, that it can be updated
    this.piechartBrowser()
  }

 
}
