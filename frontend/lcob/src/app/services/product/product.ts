import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { IcartObj, IproductGetObj, IproductObj } from '../../models/model';
import { sign } from 'crypto';

@Injectable({
  providedIn: 'root',
})
export class Product {
  dashboardApi: string = 'http://localhost:5001/api/dashboard';

  cartItems = signal<
    Array<{ productId: IproductGetObj; quantity: number; _id: string }>
  >([]);
  private productCache: IproductGetObj[] | null = null;
  constructor(private http: HttpClient) {}

  getAllProducts() {
    if (this.productCache) {
      return of(this.productCache);
    } else {
      return this.http
        .get<IproductGetObj[]>('http://localhost:5001/api/dashboard/products')
        .pipe(
          tap((products) => (this.productCache = products)) //updates the product cache
        );
    }
  }

  clearCache() {
    this.productCache = null;
  }

  updateProduct(productObj: any) {
    return this.http.put(
      `${this.dashboardApi}/products/${productObj._id}`,
      productObj,
      { withCredentials: true }
    );
  }

  getProductDetailById(id: string) {
    return this.http.get<{ success: boolean; product: IproductGetObj }>(
      `http://localhost:5001/api/products/${id}`
    );
  }

  addToCart(productId: string) {
    return this.http.post(
      `http://localhost:5001/api/cart`,
      { productId },
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
        .get<IcartObj>(`http://localhost:5001/api/cart`)
        .pipe(tap((cart) => this.cartItems.set(cart.items)));
    }
  }

  clearCart() {
    this.cartItems.set([]);
  }

  deleteCartItem(id:string){
    return this.http.delete(`http://localhost:5001/api/cart/${id}`,{withCredentials:true})
  }
}
