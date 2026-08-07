import { CommonModule } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RegistrationRequest } from '../../../../services/models';
import { register } from '../../../../services/functions';
import { ApiConfiguration } from '../../../../services/api-configuration';
import { handleApiError } from '../../../../core/utils/error-handler.utils';


@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  private http = inject(HttpClient);
  private router = inject(Router);
  private config = inject(ApiConfiguration);
  private cdr = inject(ChangeDetectorRef);

  registerRequest: RegistrationRequest = { firstname: '', lastname: '', email: '', password: '' };
  errorMsg: Array<string> = [];

  onRegister(): void {
    this.errorMsg = [];
    register(this.http, this.config.rootUrl, { body: this.registerRequest }).subscribe({
      next: () => {
        this.router.navigate(['activate-account']);
      },
      error: (err: HttpErrorResponse) => {
        this.errorMsg = handleApiError(err);
        this.cdr.detectChanges();
      }
    });
  }

  login(): void {
    this.router.navigate(['login']);
  }
}
