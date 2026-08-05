import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideApiConfiguration } from './services/api-configuration';
import { routes } from './app.routes';
import { httpTokenInterceptor } from './core/interceptors/http-token.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([httpTokenInterceptor])
    ),
    provideApiConfiguration('http://localhost:8088/api/v1')
  ]
};
