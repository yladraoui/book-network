import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { BookCard } from '../../components/book-card/book-card';
import { Pagination } from '../../../../shared/components/pagination/pagination';
import { BookResponse, PageResponseBookResponse } from '../../../../services/models';
import { findAllBooks, requestBorrowBook } from '../../../../services/functions';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ApiConfiguration } from '../../../../services/api-configuration';

@Component({
  selector: 'app-book-list',
  imports: [CommonModule, BookCard, Pagination],
  templateUrl: './book-list.html',
  styleUrl: './book-list.scss',
})
export class BookList implements OnInit{
 private http = inject(HttpClient);
  private router = inject(Router);
  private config = inject(ApiConfiguration);
  private cdr = inject(ChangeDetectorRef);

  bookResponse: PageResponseBookResponse = {};
  page = 0;
  size = 9;
  message = '';
  level: 'success' | 'danger' = 'success';

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(): void {
    findAllBooks(this.http, this.config.rootUrl, { page: this.page, size: this.size }).subscribe({
      next: (res) => {
        this.bookResponse = res.body || {};
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error while loading books:', err)
    });
  }

  /**
   * Submits a borrow request for the selected book and triggers an email to the owner.
   */
  requestBorrow(book: BookResponse): void {
    if (!book.id) return;
    this.message = '';

    requestBorrowBook(this.http, this.config.rootUrl, { 'book-id': book.id }).subscribe({
      next: () => {
        this.level = 'success';
        this.message = `Borrow request sent successfully for "${book.title}"! An email notification has been sent to the owner.`;
        this.loadBooks();
      },
      error: (err) => {
        this.level = 'danger';
        this.message = err.error?.error || 'Failed to submit borrow request.';
        this.cdr.detectChanges();
      }
    });
  }

  displayBookDetails(book: BookResponse): void {
    if (book.id) {
      this.router.navigate(['books', 'details', book.id]);
    }
  }

  onPageChange(newPage: number): void {
    this.page = newPage;
    this.loadBooks();
    this.cdr.detectChanges();
  }
}
