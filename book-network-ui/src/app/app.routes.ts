import { Routes } from '@angular/router';
import { FeedbackCard } from './features/feedback/components/feedback-card/feedback-card';
import { FeedbackList } from './features/feedback/pages/feedback-list/feedback-list';
import { BookDetails } from './features/book/pages/book-details/book-details';
import { Landing } from './shared/components/landing/landing';
import { authGuard } from './core/guards/auth.guard';
import { Profile } from './features/profile/pages/profile/profile';

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
        path: 'profile',
        canActivate: [authGuard],
        component: Profile
    },
    {
        path: 'book-details-test',
        component: BookDetails
    },
    { path: '**', redirectTo: 'welcome' }
];
