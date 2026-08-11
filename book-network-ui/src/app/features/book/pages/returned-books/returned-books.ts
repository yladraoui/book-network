import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { Pagination } from '../../../../shared/components/pagination/pagination';
import { Rating } from '../../components/rating/rating';
import { HttpClient } from '@angular/common/http';
import { ApiConfiguration } from '../../../../services/api-configuration';
import { BorrowedBookResponse, PageResponseBorrowedBookResponse } from '../../../../services/models';
import { approveReturnBorrowedBook, findAllBooksReturnedBooks } from '../../../../services/functions';

@Component({
  selector: 'app-returned-books',
  imports: [CommonModule, Pagination, Rating],
  templateUrl: './returned-books.html',
  styleUrl: './returned-books.scss',
})
export class ReturnedBooks implements OnInit{
  private http = inject(HttpClient);
  private config = inject(ApiConfiguration);
  private cdr = inject(ChangeDetectorRef);

  returnedBooksResponse: PageResponseBorrowedBookResponse = {};

  page = 0;
  size = 5;

  message = '';
  level: 'success' | 'danger' = 'success';

  ngOnInit(): void {
    this.loadReturnedBooks();
  }

  /**
   * Load the list of returned books waiting for owner approval
   */
  loadReturnedBooks(): void {
    findAllBooksReturnedBooks(this.http, this.config.rootUrl, {
      page: this.page,
      size: this.size,
    }).subscribe({
      next: (res) => {
        this.returnedBooksResponse = res.body || {};
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error while loading returned books', err);
      },
    });
  }

  /**
   * Approve the return of a borrowed book
   */
  approveBookReturn(book: BorrowedBookResponse): void {
    if (!book.id) return;
    this.message = '';
    console.log(">>>>> Book <<<<<<<< ", book);
    console.log(">>>>> Book.ID <<<<<<<< ", book.id);
    approveReturnBorrowedBook(this.http, this.config.rootUrl, {
      'book-id': book.id,
    }).subscribe({
      next: () => {
        this.level = 'success';
        this.message = `Return for book "${book.title || 'Untitled'}" approved successfully!`;
        this.loadReturnedBooks();
      },
      error: (err) => {
        this.level = 'danger';
        this.message = err.error?.error || 'Failed to approve book return.';
        this.cdr.detectChanges();
      },
    });
  }

  /**
   * Handle pagination change
   */
  onPageChange(newPage: number): void {
    this.page = newPage;
    this.loadReturnedBooks();
  }
}
