import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Menu } from './shared/components/menu/menu';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, Menu],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('book-network-ui');
  private router = inject(Router);

  get isAuthPage(): boolean {
    return (this.router.url.includes('/login') || this.router.url.includes('/registe') || this.router.url.includes('/welcome') );
  }
}
