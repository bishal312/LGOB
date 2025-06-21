import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient,  withFetch,  withInterceptors } from '@angular/common/http';
import { credentialsInterceptor } from './interceptors/credentials-interceptor';
import { errorInterceptor } from './interceptors/error-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withHashLocation()), provideClientHydration(withEventReplay()),
    provideHttpClient(withInterceptors([credentialsInterceptor,errorInterceptor]),withFetch()),
    
    
  ]
};
