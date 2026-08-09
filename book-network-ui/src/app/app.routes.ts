import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    {
        path: '',
        loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
    },
    {
    path: 'books',
    loadChildren: () => import('./features/book/book.routes').then(m => m.BOOK_ROUTES)
    },
    { path: '**', redirectTo: 'login' }
];
