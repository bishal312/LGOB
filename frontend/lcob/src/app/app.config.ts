import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient,  withFetch,  withInterceptors } from '@angular/common/http';
import { credentialsInterceptor } from './interceptors/credentials-interceptor';
import { authorizeInterceptor } from './interceptors/authorize-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes), provideClientHydration(withEventReplay()),
    provideHttpClient(withInterceptors([credentialsInterceptor,authorizeInterceptor]),withFetch()),
    
    
  ]
};
