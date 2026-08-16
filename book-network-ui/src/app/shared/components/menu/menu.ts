import { Component, inject, OnInit } from '@angular/core';
import { TokenService } from '../../../core/services/token/token.service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-menu',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './menu.html',
  styleUrl: './menu.scss',
})
export class Menu implements OnInit{
private tokenService = inject(TokenService);
  private router = inject(Router);

  isAdmin = false;

  ngOnInit(): void {
    this.checkAdminRole();
  }

  private checkAdminRole(): void {
    const token = this.tokenService.token;
    if (token) {
      const roles = this.tokenService.userRoles;
      this.isAdmin = roles.includes('ADMIN') || roles.includes('ROLE_ADMIN');
    }
  }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/welcome']);
  }
}
