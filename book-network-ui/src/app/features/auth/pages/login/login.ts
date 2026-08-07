import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from '../../../../core/services/token/token.service';
import { AuthenticationRequest } from '../../../../services/models';
import { authenticate } from '../../../../services/functions';
import { ApiConfiguration } from '../../../../services/api-configuration';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { handleApiError } from '../../../../core/utils/error-handler.utils';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private http = inject(HttpClient);
  private router = inject(Router);
  private config = inject(ApiConfiguration)
  private tokenService = inject(TokenService);
  private cdr = inject(ChangeDetectorRef);

  authRequest: AuthenticationRequest = {'email': '', password: ''};
  errorMessage: Array<string> = [];

  login(): void {
    this.errorMessage = [];
    authenticate(this.http, this.config.rootUrl, { body: this.authRequest}).subscribe({
      next: (res) => {
        if(res.body?.token){
          this.tokenService.token = res.body.token;
          this.router.navigate(['books']);
        }
      },
      error: (err: HttpErrorResponse) => {
        console.log(">>>>> err : ", err);
        this.errorMessage = handleApiError(err);
        this.cdr.detectChanges();

      }
    })
  }

  register(): void {
    this.router.navigate(['register']);
  }
}
