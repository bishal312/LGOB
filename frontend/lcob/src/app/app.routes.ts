import { Routes } from '@angular/router';
import { MainLayout } from './layout/main-layout/main-layout'; // a new wrapper component
import { Home } from './user/home/home';
import { Login } from './auth/login/login';
import { Signup } from './auth/signup/signup';
import { Product } from './user/product/product';
import { Checkout } from './user/checkout/checkout';
import { Success } from './user/success/success';
import { Myorders } from './user/myorders/myorders';
import { Dashboard } from './seller/dashboard/dashboard';
import { Orders } from './seller/orders/orders';
import { SellerLayout } from './seller/seller-layout/seller-layout';
import { MyProducts } from './seller/my-products/my-products';
import { Delivery } from './seller/delivery/delivery';
import { About } from './user/about/about';
import { authGuard } from './services/guards/auth-guard';
import { Shop } from './user/shop/shop';

export const routes: Routes = [
  // MAIN ROUTES (with header/footer)
  {
    path: '',
    component: MainLayout,  // This wraps header/footer
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: Home, title: 'Home' },
      { path: 'shop',
        component:Shop,
         title:'Shop' },
      { path: 'shop/product/:id', component: Product, title: 'Product' },
      { path: 'shop/checkout', component: Checkout, title: 'Checkout' , canActivate:[authGuard]},
      { path: 'shop/success', component: Success, title: 'Success', canActivate:[authGuard] },
      { path: 'shop/my-orders', component: Myorders, title: 'My Orders', canActivate:[authGuard] },
      { path: 'about', component: About, title: 'About Us' },
    ],
  },

  // AUTH ROUTES (no layout)
  { path: 'login', component: Login, title: 'Login' },
  { path: 'signup', component: Signup, title: 'Signup' },

  // SELLER ROUTES (no layout)
  {
    path: 'seller',
    component:SellerLayout,
    children: [
      { path: 'login', component: Login },
      { path: 'dashboard', component: Dashboard, title: 'Dashboard' },
      { path: 'orders', component: Orders, title: 'Orders' },
      { path: 'my-products', component: MyProducts, title: 'My Products' },
      { path: 'delivery', component: Delivery, title: 'Delivery List' },
    ],
  },

  // WILDCARD (404)
  { path: '**', redirectTo: 'home' },
];
