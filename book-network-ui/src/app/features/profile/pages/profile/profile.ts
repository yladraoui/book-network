import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ApiConfiguration } from '../../../../services/api-configuration';
import { ChangePasswordRequest, UpdateProfileRequest, UserProfileResponse } from '../../../../services/models';
import { changePassword, getProfile, updateProfile } from '../../../../services/functions';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile implements OnInit{
  private http = inject(HttpClient);
  private config = inject(ApiConfiguration);
  private cdr = inject(ChangeDetectorRef);

  profile: UserProfileResponse = {};
  
  updateRequest: UpdateProfileRequest = {
    firstname: '',
    lastname: '',
    dateOfBirth: ''
  };

  passwordRequest: ChangePasswordRequest = {
    currentPassword: '',
    newPassword: '',
    confirmationPassword: ''
  };

  fullname = 'user user';

  profileMessage = '';
  profileMessageType: 'success' | 'danger' = 'success';

  passwordMessage = '';
  passwordMessageType: 'success' | 'danger' = 'success';

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    getProfile(this.http, this.config.rootUrl).subscribe({
      next: (res) => {
        this.profile = res.body;
        this.updateRequest = {
          firstname: res.body.firstname || '',
          lastname: res.body.lastname || '',
          dateOfBirth: res.body.dateOfBirth || ''
        };
        this.fullname = res.body.firstname + ' ' + res.body.lastname || 'user user';
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erreur chargement profil', err);
      }
    });
  }

  onUpdateProfile(): void {
    this.profileMessage = '';
    updateProfile(this.http, this.config.rootUrl,{ body: this.updateRequest} ).subscribe({
      next: (res) => {
        this.profile = res.body;
        this.profileMessageType = 'success';
        this.profileMessage = 'Profile updated successfully!';
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.profileMessageType = 'danger';
        this.profileMessage = err.error?.error || 'Failed to update profile.';
        this.cdr.detectChanges();
      }
    });
  }

  onChangePassword(): void {
    this.passwordMessage = '';

    if (this.passwordRequest.newPassword !== this.passwordRequest.confirmationPassword) {
      this.passwordMessageType = 'danger';
      this.passwordMessage = 'New password and confirmation do not match.';
      this.cdr.detectChanges();
      return;
    }

    changePassword(this.http,this.config.rootUrl, {body: this.passwordRequest}).subscribe({
      next: () => {
        this.passwordMessageType = 'success';
        this.passwordMessage = 'Password changed successfully!';
        this.passwordRequest = { currentPassword: '', newPassword: '', confirmationPassword: '' };
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.passwordMessageType = 'danger';
        this.passwordMessage = err.error?.error || 'Failed to change password. Please check your current password.';
        this.cdr.detectChanges();
      }
    });
  }
}
