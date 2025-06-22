import { HttpClient } from '@angular/common/http';
import { computed, Injectable, signal } from '@angular/core';
import { of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { IcartObj, IproductGetObj } from '../../models/model';
import { toObservable } from '@angular/core/rxjs-interop';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Product {
  dashboardApi: string = 'http://localhost:5001/api/dashboard';

  cartItems = signal<
    Array<{ productId: IproductGetObj; quantity: number; _id: string }>
  >([]);

  private readonly productCache=signal<IproductGetObj[]>([])
   readonly products = computed(() => this.productCache());

  constructor(private http: HttpClient) {}

  getAllProducts() {
    if (this.productCache().length > 0) {
      
      return of(this.productCache());
    } else {
      return this.http
        .get<IproductGetObj[]>(`${environment.apiUrl}/dashboard/products`)
        .pipe(
          tap((products) =>  (this.productCache.set(products))) //updates the product cache
        );
    }
  }

  getProductUser(){
    return this.http.get<IproductGetObj[]>(`${environment.apiUrl}/products`)
  }


  
  updateStockAfterOrder(order: { items: { productId: string; quantity: number }[] }) {
  this.productCache.update(products =>
    products.map(product => {
      const orderItem = order.items.find(item => item.productId === product._id);
      if (orderItem) {
        return { ...product, stock: product.stock - orderItem.quantity };
      }
      return product;
    })
  );
}


  clearCache() {
    this.productCache.set([])
  }



  updateProduct(productObj: any) {
    return this.http.put(
      `${environment.apiUrl}/dashboard/products/${productObj._id}`,
      productObj,
      { withCredentials: true }
    );
  }

  deleteProduct(_id: string) {
    return this.http.delete(`${environment.apiUrl}/dashboard/products/${_id}`)
  }

  getProductDetailById(id: string) {
    return this.http.get<{ success: boolean; product: IproductGetObj }>(
      `${environment.apiUrl}/products/${id}`
    );
  }

  addToCart(productId: string, quantity?: number) {
    return this.http.post(
      `${environment.apiUrl}/cart/add`,
      { productId, quantity },
      { withCredentials: true }
    );
  }

  getCartItemsByUserId() {
    const cachedItems = this.cartItems();
    if (this.cartItems().length > 0) {
      return of({
        _id: 'cached',
        userId: 'local',
        items: cachedItems,
        createdAt: '',
        updatedAt: '',
        __v: 0,
      });
    } else {
      return this.http
        .get<IcartObj>(`${environment.apiUrl}/cart`)
        .pipe(tap((cart) => this.cartItems.set(cart.items)));
    }
  }

  clearCart() {
    this.cartItems.set([]);
  }

  deleteCartItem(id: string) {
    return this.http.delete(`${environment.apiUrl}/cart/remove/${id}`, {
      withCredentials: true,
    });
  }

  clearAllCartItems() {
    return this.http.delete(`${environment.apiUrl}/cart/clear`, {
      withCredentials: true,
    });
  }
}
