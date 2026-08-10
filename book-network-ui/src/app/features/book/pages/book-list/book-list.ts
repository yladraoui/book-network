import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { BookCard } from '../../components/book-card/book-card';
import { Pagination } from '../../../../shared/components/pagination/pagination';
import { BookResponse, PageResponseBookResponse } from '../../../../services/models';
import { borrowBook, findAllBooks } from '../../../../services/functions';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ApiConfiguration } from '../../../../services/api-configuration';

@Component({
  selector: 'app-book-list',
  imports: [CommonModule, BookCard, Pagination],
  templateUrl: './book-list.html',
  styleUrl: './book-list.scss',
})
export class BookList {
 private http = inject(HttpClient);
  private router = inject(Router);
  private config = inject(ApiConfiguration);
  private cdr = inject(ChangeDetectorRef);

  bookResponse: PageResponseBookResponse = {};
  page = 0;
  size = 8;
  message = '';
  level: 'success' | 'danger' = 'success';

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(): void {
    findAllBooks(this.http, this.config.rootUrl, { page: this.page, size: this.size }).subscribe({
      next: (res) => {
        console.log(">>>> res :", res);
        this.bookResponse = res.body || {};
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error while uploading books', err)
    });
    
  }

  borrowBook(book: BookResponse): void {
    if (!book.id) return;
    this.message = '';

    borrowBook(this.http, this.config.rootUrl, { 'book-id': book.id }).subscribe({
      next: () => {
        this.level = 'success';
        this.message = `Le livre "${book.title}" a été emprunté avec succès !`;
        this.loadBooks();
      },
      error: (err) => {
        this.level = 'danger';
        this.message = err.error?.error || 'Impossible d\'emprunter ce livre.';
      }
    });
  }

  onPageChange(newPage: number): void {
    this.page = newPage;
    this.loadBooks();
    this.cdr.detectChanges();
  }
}
