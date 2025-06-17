import { Component, computed, effect, inject, signal } from '@angular/core';
import { Product } from '../../services/product/product';
import { NgClass, NgIf } from '@angular/common';
import { FormControl, FormGroup } from '@angular/forms';
import { OrderItem, Suggestion } from '../../models/model';
import { Order } from '../../services/order/order';
import { error } from 'console';
import { Router, RouterLink } from '@angular/router';
import { GoogleApiLoader } from '../../services/google-api-loader/google-api-loader';

@Component({
  selector: 'app-my-cart',
  imports: [NgIf, RouterLink, NgClass],
  templateUrl: './my-cart.html',
  styleUrl: './my-cart.css',
})
export class MyCart {
  queryAddress = signal('');
  showSuggestions = signal(false);
  suggestions = signal<Suggestion[]>([]);
  showPopup: boolean = false;
  checkoutMessage: string = '';
  skipNextInput = false;
  placeHolder: string = 'Enter Delivery Address';
  googleApiService = inject(GoogleApiLoader);

  private debounceTimeout?: ReturnType<typeof setTimeout>;

  orderFormObj: FormGroup = new FormGroup({
    items: new FormControl([]),
    totalAmount: new FormControl(0),
    address: new FormControl(),
    location: new FormGroup({
      latitude: new FormControl(0),
      longitude: new FormControl(0),
    }),
  });

  subTotal = computed(() =>
    this.productService
      .cartItems()
      .reduce((total, item) => total + item.productId.price * item.quantity, 0)
  );

  deliveryFee = computed(() => this.subTotal() * 0.1);
  allCartItems = computed(() => this.productService.cartItems());
  total = computed(() => this.subTotal() + this.deliveryFee());

  router = inject(Router);
  orderService = inject(Order);
  productService = inject(Product);
  ngOnInit() {
    this.productService.getCartItemsByUserId().subscribe(
      () => {},
      (error) => {
        console.log(error);
      }
    );
  }

  constructor() {
    effect(() => {
      const address = this.queryAddress();
      if (this.debounceTimeout) clearTimeout(this.debounceTimeout);

      this.debounceTimeout = setTimeout(() => {
        if (address.length < 3) {
          this.suggestions.set([]);
          this.showSuggestions.set(false);
          return;
        }
        this.showSuggestions.set(true);
        this.googleApiService.getPlacesName(address).subscribe((res: any) => {
          this.suggestions.set(res.suggestions);
        });
      }, 1000);
    });
  }

  deleteCartItemById(id: string) {
    this.productService.deleteCartItem(id).subscribe((res: any) => {
      this.productService.clearCart();
      this.productService.getCartItemsByUserId().subscribe(
        (res: any) => {},
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

  onAddressInput(address: string) {
    if (this.skipNextInput) {
      this.skipNextInput = false;
      return;
    }
    const matchedAddress = this.suggestions().find(
      (suggestion) =>
        suggestion.placePrediction?.text?.text === this.queryAddress()
    );
    if (matchedAddress) {
      this.suggestions.set([]);
      return;
    }

    this.queryAddress.set(address);
  }

  onAddressSelect(address: Suggestion) {
    this.skipNextInput = true; // block next input events for now
    setTimeout(() => {
      this.skipNextInput = false; // unblock after 2 seconds
    }, 2000);
    this.queryAddress.set(address.placePrediction?.text?.text ?? '');
    this.showSuggestions.set(false);
    const addressText = address.placePrediction?.text?.text ?? '';
    this.orderFormObj.controls['address'].setValue(addressText);
    if (address.placePrediction?.placeId) {
      this.googleApiService
        .getCoordinates(address.placePrediction?.placeId)
        .subscribe(
          (res: any) => {
            this.orderFormObj.patchValue({
              location: {
                latitude: res.location.latitude,
                longitude: res.location.longitude,
              },
            });
          },
          (error) => {
            console.log('error while getting coordinates', error);
          }
        );
    } else {
      this.orderFormObj.controls['location'].setValue({
        latitude: 0,
        longitude: 0,
      });
    }
  }

  checkoutProcess() {
    this.showPopup = true;
    this.checkoutMessage = 'Please wait for a moment...';
    this.orderFormObj.controls['totalAmount'].setValue(this.total());
    const totalItems: OrderItem[] = [];
    for (let item of this.allCartItems()) {
      const newItem: OrderItem = {
        productId: item.productId._id,
        quantity: item.quantity,
      };
      totalItems.push(newItem);
    }
    this.orderFormObj.controls['items'].setValue(totalItems);

    this.orderService.placeOrder(this.orderFormObj.value).subscribe(
      (res: any) => {
        if (res.message === 'Order placed successfully') {
          this.showPopup = true;
          this.checkoutMessage = res.message;
          setTimeout(() => {
            this.showPopup = false;
            this.router.navigate(['/shop/my-orders']);
            this.checkoutMessage = '';
            this.clearCart();
          });
        }
      },
      (error) => {
        this.showPopup = true;
        this.checkoutMessage = error.message;
        setTimeout(() => {
          this.showPopup = false;
          this.checkoutMessage = '';
        });
      }
    );
  }
}
