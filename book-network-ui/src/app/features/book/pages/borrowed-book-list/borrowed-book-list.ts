import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { Pagination } from '../../../../shared/components/pagination/pagination';
import { Rating } from '../../components/rating/rating';
import { HttpClient } from '@angular/common/http';
import { ApiConfiguration } from '../../../../services/api-configuration';
import { BorrowedBookResponse, PageResponseBorrowedBookResponse } from '../../../../services/models';
import { findAllBooksBorrowedBooks, returnBorrowedBook } from '../../../../services/functions';

@Component({
  selector: 'app-borrowed-book-list',
  imports: [CommonModule, Pagination, Rating],
  templateUrl: './borrowed-book-list.html',
  styleUrl: './borrowed-book-list.scss',
})
export class BorrowedBookList implements OnInit{
  private http = inject(HttpClient);
  private config = inject(ApiConfiguration);
  private cdr = inject(ChangeDetectorRef);

  borrowedBooksResponse: PageResponseBorrowedBookResponse = {};
  selectedBook: BorrowedBookResponse | null = null;

  page = 0;
  size = 5;

  message = '';
  level: 'success' | 'danger' = 'success';

  ngOnInit(): void {
    this.loadBorrowedBooks();
  }

  /**
   * Load the list of borrowed books for the current user
   */
  loadBorrowedBooks(): void {
    findAllBooksBorrowedBooks(this.http, this.config.rootUrl, {
      page: this.page,
      size: this.size,
    }).subscribe({
      next: (res) => {
        this.borrowedBooksResponse = res.body || {};
        console.log(">>>>>>>>>>>>>BookResponse", this.borrowedBooksResponse.content);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error while loading borrowed books', err);
      },
    });
  }

  /**
   * Return a borrowed book by ID
   */
  returnBook(book: BorrowedBookResponse): void {
    if (!book.id) return;
    this.message = '';
    console.log(">>>>>> bookId <<<<<<< ",book.id);;
    console.log(">>>>>> book <<<<<<< ",book);;
    returnBorrowedBook(this.http, this.config.rootUrl, {
      'book-id': book.id,
    }).subscribe({
      next: () => {
        this.level = 'success';
        this.message = `Book "${book.title}" returned successfully! Waiting for owner approval.`;
        this.loadBorrowedBooks();
      },
      error: (err) => {
        this.level = 'danger';
        this.message = err.error?.error || 'Failed to return the book.';
        this.cdr.detectChanges();
      },
    });
  }

  /**
   * Handle pagination change
   */
  onPageChange(newPage: number): void {
    this.page = newPage;
    this.loadBorrowedBooks();
  }
}
