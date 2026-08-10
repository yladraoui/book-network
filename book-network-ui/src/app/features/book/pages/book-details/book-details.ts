import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, Input, OnInit, Output } from '@angular/core';
import { FeedbackCard } from '../../../feedback/components/feedback-card/feedback-card';
import { FeedbackList } from '../../../feedback/pages/feedback-list/feedback-list';
import { BookResponse } from '../../../../services/models';
import { borrowBook, findBookById } from '../../../../services/functions';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ApiConfiguration } from '../../../../services/api-configuration';

@Component({
  selector: 'app-book-details',
  imports: [CommonModule, FeedbackList],
  templateUrl: './book-details.html',
  styleUrl: './book-details.scss',
})
export class BookDetails implements OnInit{

  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);
  private config = inject(ApiConfiguration);
  private cder = inject(ChangeDetectorRef);

  book: BookResponse = {};
  message = '';
  level: 'success' | 'danger' = 'success';

  get bookId(): number {
    return this.book?.id ?? 0;
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = Number(idParam);
      this.loadBookDetails(id);
    }
  }

  loadBookDetails(bookId: number): void {
    findBookById(this.http, this.config.rootUrl, { 'book-id': bookId }).subscribe({
      next: (res) => {
        this.book = res.body || {};
        this.cder.detectChanges();
      },
      error: (err) => console.error('Erreur lors du chargement du livre', err)
    });
  }

  onBorrowBook(): void {
    if (!this.book.id) return;
    this.message = '';

    borrowBook(this.http, this.config.rootUrl, { 'book-id': this.book.id }).subscribe({
      next: () => {
        this.level = 'success';
        this.message = `Le livre "${this.book.title}" a été emprunté avec succès !`;
        if (this.book.id) {
          this.loadBookDetails(this.book.id);
        }
      },
      error: (err) => {
        this.level = 'danger';
        this.message = err.error?.error || 'Impossible d\'emprunter ce livre.';
        this.cder.detectChanges();
      }
    });
  }

  get fullStars(): number[] {
    return Array(Math.floor(this.book?.rate || 0)).fill(0);
  }

  get emptyStars(): number[] {
    return Array(5 - Math.floor(this.book?.rate || 0)).fill(0);
  }
}
