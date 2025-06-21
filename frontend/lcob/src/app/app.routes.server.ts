import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  { path: '', renderMode: RenderMode.Prerender },            // homepage prerendered at build time
  { path: 'home', renderMode: RenderMode.Prerender },        // same here
  { path: 'about', renderMode: RenderMode.Prerender },       // static pages prerendered

  { path: 'shop', renderMode: RenderMode.Server },           // runtime SSR (good for dynamic/shop pages)
  { path: 'shop/my-cart', renderMode: RenderMode.Server },
  { path: 'shop/product/:id', renderMode: RenderMode.Server },    // dynamic param, so runtime SSR
  { path: 'shop/checkout/:id', renderMode: RenderMode.Server },

  { path: 'seller', renderMode: RenderMode.Server },         // seller routes usually need runtime SSR
  { path: 'seller/orders/order-detail/:id', renderMode: RenderMode.Server },

  // fallback wildcard
  { path: '**', renderMode: RenderMode.Server },
];
