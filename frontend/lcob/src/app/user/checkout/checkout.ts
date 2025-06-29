import {
  Component,
  computed,
  effect,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { Product } from '../../services/product/product';

import { ActivatedRoute, Router } from '@angular/router';
import { IproductGetObj, OrderItem, Suggestion } from '../../models/model';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Order } from '../../services/order/order';
import { AsyncPipe, NgClass, NgIf } from '@angular/common';
import { GoogleApiLoader } from '../../services/google-api-loader/google-api-loader';

import { DialogBox } from '../../services/dialog/dialog-box';
import { MatDialogModule } from '@angular/material/dialog';
import { Loader } from '../../mat-services/loader/loader';
import { LoadingComponent } from "../../services/loading-component/loading-component/loading-component";

@Component({
  selector: 'app-checkout',
  imports: [ReactiveFormsModule, NgIf, NgClass, MatDialogModule, AsyncPipe, LoadingComponent],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class Checkout implements OnInit {
  orderFormObj: FormGroup = new FormGroup({
    items: new FormControl([]),
    totalAmount: new FormControl(0),
    address: new FormControl(''),
    location: new FormGroup({
      latitude: new FormControl(),
      longitude: new FormControl(),
    }),
  });

  dialogBox = inject(DialogBox);
  loaderService = inject(Loader);
  quantity = signal(1);
  name: string = '';
  phonenumber: string = '';
  showPopup: boolean = false;
  queryAddress = signal('');
  showSuggestions = signal(false);
  suggestions = signal<Suggestion[]>([]);

  productDetail = signal<IproductGetObj | null>(null);
  totalAmount = computed(
    () => (this.productDetail()?.price ?? 0) * this.quantity()
  );
  deliveryFee = computed(() => this.totalAmount() * 0); // 10% of total //for now it is set to 0
  totalOrderAmount = computed(() => this.totalAmount() + this.deliveryFee());

  skipNextInput = false;
  placeHolder: string = 'Enter Delivery Address';

  constructor(private route: ActivatedRoute) {
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

  productId: string = '';
  checkoutMessage: string = '';

  router = inject(Router);
  productService = inject(Product);
  orderService = inject(Order);
  googleApiService = inject(GoogleApiLoader);

  private debounceTimeout?: ReturnType<typeof setTimeout>;

  ngOnInit() {
    this.bindUserDetail();

    this.productId = this.route.snapshot.params['id'];
    const quantity = this.route.snapshot.queryParamMap.get('quantity');
    if (quantity) {
      this.quantity.set(Number(quantity));
    }

    this.productService
      .getProductDetailById(this.productId)
      .subscribe((res: { success: boolean; product: IproductGetObj }) => {
        this.productDetail.set(res.product);
      });
  }

  bindUserDetail() {
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      this.name = userData.fullName;

      this.phonenumber = userData.phoneNumber;
    } else {
      return;
    }
  }

  checkoutProcess() {
    this.dialogBox
      .openWithoutContinue(
        'In a moment, your order will be placed!',
        'In Progress',
        1500,
        false
      )
      .subscribe(() => {
        
        this.orderFormObj.controls['totalAmount'].setValue(this.totalOrderAmount());
        const newItem: OrderItem = {
          productId: this.productId,
          quantity: this.quantity(),
        };
        this.orderFormObj.controls['items'].setValue([newItem]);
        const value = this.orderFormObj.value;
        this.orderService.placeOrder(value).subscribe(
          (res: any) => {
            if (res.message === 'Order placed successfully') {
              this.dialogBox
                .openWithoutContinue(res.message, 'Success', 1500, false)
                .subscribe(() => {});
    
              this.router.navigate(['/shop/my-orders']);
            }
          },
          (error) => {
            console.log('error while placing order', error);
            this.dialogBox
              .openWithoutContinue(error.message, 'Success', 1500, false)
              .subscribe(() => {});
          }
        );
      });


  }

  onAddressInput(address: string) {
    if (this.skipNextInput) {
      this.skipNextInput = false;
      return;
    }
    if (this.suggestions()) {
      if (this.suggestions().length === 0) {
        this.showSuggestions.set(true);
      } else if (this.suggestions().length !== 0) {
        const matchedAddress = this.suggestions().find(
          (suggestion) =>
            suggestion.placePrediction?.text?.text === this.queryAddress()
        );
        if (matchedAddress) {
          this.suggestions.set([]);
          return;
        }
      }
    }

    this.queryAddress.set(address);
  }

  onAddressSelect(address: Suggestion) {
    this.skipNextInput = true; // block next input events for now
    setTimeout(() => {
      this.skipNextInput = false; // unblock after 10 seconds
    }, 10000);
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
}
