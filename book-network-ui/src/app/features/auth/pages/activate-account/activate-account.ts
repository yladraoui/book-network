import { CommonModule } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { confirm } from '../../../../services/functions';
import { ApiConfiguration } from '../../../../services/api-configuration';


@Component({
  selector: 'app-activate-account',
  imports: [CommonModule, FormsModule],
  templateUrl: './activate-account.html',
  styleUrl: './activate-account.scss',
})
export class ActivateAccount {
  private http = inject(HttpClient);
  private router = inject(Router);
  private config = inject(ApiConfiguration);
  private cdr = inject(ChangeDetectorRef);

  token = '';
  message = '';
  isSubmitted = false;
  isOkay = true;

  onConfirm(): void {
    this.message = '';
    confirm (this.http,this.config.rootUrl, { token: this.token }).subscribe({
      next: () => {
        this.message = 'Your account has been activated successfully!';
        this.isSubmitted = true;
        this.isOkay = true;
        this.cdr.detectChanges();
        console.log(this.message);
      },

      error: async (err: HttpErrorResponse) =>{
        console.log(err.error);

        this.message = await JSON.parse(err.error).error;
        this.isSubmitted = true;
        this.isOkay = false;
        this.cdr.detectChanges();
        console.log(this.message);
      }
    })
  }

  goToLogin (): void {
    this.router.navigate(['login']);
  }
}
