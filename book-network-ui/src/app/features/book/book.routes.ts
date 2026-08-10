import { Routes } from "@angular/router";
import { BookList } from "./pages/book-list/book-list";
import { MyBooks } from "./pages/my-books/my-books";
import { ManageBook } from "./pages/manage-book/manage-book";
import { BookDetails } from "./pages/book-details/book-details";
import { BorrowedBookList } from "./pages/borrowed-book-list/borrowed-book-list";

export const BOOK_ROUTES: Routes = [
  { path: '', component: BookList },
  { path: 'my-books', component: MyBooks },
  { path: 'borrowed-books', component: BorrowedBookList },
  { path: 'manage', component: ManageBook },
  { path: 'manage/:id', component: ManageBook },
  { path: 'details/:id', component: BookDetails }
];