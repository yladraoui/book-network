import { Routes } from "@angular/router";
import { BookList } from "./pages/book-list/book-list";
import { MyBooks } from "./pages/my-books/my-books";
import { ManageBook } from "./pages/manage-book/manage-book";

export const BOOK_ROUTES: Routes = [
  { path: '', component: BookList },
  { path: 'my-books', component: MyBooks },
  { path: 'manage', component: ManageBook },
  { path: 'manage/:id', component: ManageBook }
];