import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ApiConfiguration } from '../../../../services/api-configuration';
import { UserProfile } from '../../../../services/models/user-profile';
import { CommonModule } from '@angular/common';
import { findAllUsers, getStats, toggleUserLockStatus } from '../../../../services/functions';
import { AdminStatsResponse } from '../../../../services/models';

@Component({
  selector: 'app-admin-dashboard',
  imports: [CommonModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.scss',
})
export class AdminDashboard implements OnInit{
private http = inject(HttpClient);
  private config = inject(ApiConfiguration);
  private cdr= inject(ChangeDetectorRef);

  stats: AdminStatsResponse = { totalUsers: 0, totalBooks: 0, totalBorrowedBooks: 0 };
  users: UserProfile[] = [];
  activeTab: 'users' | 'books' = 'users';

  ngOnInit(): void {
    this.loadStats();
    this.loadUsers();
  }

  loadStats(): void {
    getStats(this.http, this.config.rootUrl).subscribe({
      next: (res) => this.stats = res.body,
      error: (err) => console.error('Error stats', err)
    });
  }

  loadUsers(): void {
    findAllUsers(this.http, this.config.rootUrl).subscribe({
      next: (res) => {
        this.users = res.body.content || [];
        this.cdr.detectChanges();
      },
      error: (err) =>{ 
        console.error('Error users', err);
        this.cdr.detectChanges();
      }
    });
  }

  toggleLock(user: UserProfile): void {
    toggleUserLockStatus(this.http, this.config.rootUrl, {'user-id': user.id || 0}).subscribe({
      next: () => {
        user.accountLocked = !user.accountLocked;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error lock', err)
    });
  }
}
