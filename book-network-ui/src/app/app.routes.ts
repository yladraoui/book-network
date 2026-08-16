import { Routes } from '@angular/router';
import { Landing } from './shared/components/landing/landing';
import { authGuard } from './core/guards/auth.guard';
import { Profile } from './features/profile/pages/profile/profile';
import { AdminDashboard } from './features/admin/pages/admin-dashboard/admin-dashboard';
import { adminGuard } from './core/guards/admin-guard';

export const routes: Routes = [
    { path: '', redirectTo: 'welcome', pathMatch: 'full' },
    {
        path: 'welcome',
        component: Landing
    },
    {
        path: '',
        loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
    },
    {
        path: 'books',
        canActivate: [authGuard],
        loadChildren: () => import('./features/book/book.routes').then(m => m.BOOK_ROUTES)
    },
    {
        path: 'admin',
        canActivate: [adminGuard, authGuard],
        component: AdminDashboard
    },
    {
        path: 'profile',
        canActivate: [authGuard],
        component: Profile
    },
    { path: '**', redirectTo: 'welcome' }
];
