import { Routes } from '@angular/router';
import { FeedbackCard } from './features/feedback/components/feedback-card/feedback-card';
import { FeedbackList } from './features/feedback/pages/feedback-list/feedback-list';

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
    {
        path: 'feedback-test',
        component: FeedbackCard
    },
    {
        path: 'feedback-list-test',
        component: FeedbackList
    },
    { path: '**', redirectTo: 'login' }
];
