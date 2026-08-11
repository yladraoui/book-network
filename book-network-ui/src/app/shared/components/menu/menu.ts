import { Component, inject } from '@angular/core';
import { TokenService } from '../../../core/services/token/token.service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-menu',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './menu.html',
  styleUrl: './menu.scss',
})
export class Menu {
private tokenService = inject(TokenService);
  private router = inject(Router);

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
