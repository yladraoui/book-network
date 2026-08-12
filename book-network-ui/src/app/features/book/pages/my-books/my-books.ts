import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { BookCard } from '../../components/book-card/book-card';
import { Pagination } from '../../../../shared/components/pagination/pagination';
import { Router, RouterLink } from '@angular/router';
import { BookResponse, PageResponseBookResponse } from '../../../../services/models';
import { HttpClient } from '@angular/common/http';
import { ApiConfiguration } from '../../../../services/api-configuration';
import { findAllBooksByOwner, updateArchivedStatus, updateShareableStatus } from '../../../../services/functions';

@Component({
  selector: 'app-my-books',
  imports: [CommonModule, BookCard, Pagination, RouterLink],
  templateUrl: './my-books.html',
  styleUrl: './my-books.scss',
})
export class MyBooks implements OnInit{
  private http = inject(HttpClient);
  private router = inject(Router);
  private config = inject(ApiConfiguration);
  private cdr = inject(ChangeDetectorRef);

  bookResponse: PageResponseBookResponse = {};
  page = 0;
  size = 8;

  ngOnInit(): void {
    this.loadMyBooks();
  }

  loadMyBooks(): void {
    findAllBooksByOwner(this.http, this.config.rootUrl, { page: this.page, size: this.size }).subscribe({
      next: (res) => {
        console.log(">>>> res : ", res);
        console.log(">>>> res.body : ", res.body);
        this.bookResponse = res.body || {};
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Erreur lors du chargement de mes livres', err)
    });
  }

  toggleShareable(book: BookResponse): void {
    if (!book.id) return;
    updateShareableStatus(this.http, this.config.rootUrl, { 'book-id': book.id }).subscribe({
      next: () => {
        book.shareable = !book.shareable;
      },
      error: (err) => console.error('Erreur changement statut partageable', err)
    });
  }

  toggleArchive(book: BookResponse): void {
    if (!book.id) return;
    updateArchivedStatus(this.http, this.config.rootUrl, { 'book-id': book.id }).subscribe({
      next: () => {
        book.archived = !book.archived;
      },
      error: (err) => console.error('Erreur changement statut archivé', err)
    });
  }

  editBook(book: BookResponse): void {
    this.router.navigate(['/books/manage', book.id]);
  }

  onPageChange(newPage: number): void {
    this.page = newPage;
    this.loadMyBooks();
  }
}
