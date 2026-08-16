import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FeedbackRequest, PageResponseFeedbackResponse } from '../../../../services/models';
import { findAllFeedbacksByBook, saveFeedback } from '../../../../services/functions';
import { HttpClient } from '@angular/common/http';
import { ApiConfiguration } from '../../../../services/api-configuration';
import { FeedbackCard } from '../../components/feedback-card/feedback-card';
import { Pagination } from '../../../../shared/components/pagination/pagination';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-feedback-list',
  imports: [CommonModule, FormsModule, FeedbackCard, Pagination],
  templateUrl: './feedback-list.html',
  styleUrl: './feedback-list.scss',
})
export class FeedbackList implements OnInit, OnChanges{
  @Input() bookId: number = 0;

  private http = inject(HttpClient);
  private config = inject(ApiConfiguration);
  private cdr = inject(ChangeDetectorRef);

  feedbackResponse: PageResponseFeedbackResponse = {};
  showForm: boolean = false;

  feedbackRequest: FeedbackRequest = {
    bookId: 0,
    comment: '',
    score: 0
  };

  message: string = '';
  level: 'success' | 'danger' = 'success';

  page = 0;
  size = 5;

  ngOnInit(): void {
    if (this.bookId) {
      this.loadFeedbacks();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['bookId'] && !changes['bookId'].firstChange && this.bookId) {
      this.loadFeedbacks();
    }
  }

  loadFeedbacks(): void {
    if (!this.bookId) return;

    findAllFeedbacksByBook(
      this.http,
      this.config.rootUrl,
      { 'book-id': this.bookId, page: this.page, size: this.size }
    ).subscribe({
      next: (res) => {
        this.feedbackResponse = res.body || {};
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error while loading feedbacks', err)
    });
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    this.message = '';
    if (!this.showForm) {
      this.resetForm();
    }
  }

  setNote(rating: number): void {
    this.feedbackRequest.score = rating;
  }

  onSubmitFeedback(): void {
    if (!this.bookId) return;
    this.feedbackRequest.bookId = this.bookId;

    if (!this.feedbackRequest.score || this.feedbackRequest.score <= 0) {
      this.level = 'danger';
      this.message = 'Please provide a rating (1 to 5 stars).';
      return;
    }

    saveFeedback(this.http, this.config.rootUrl, { body: this.feedbackRequest }).subscribe({
      next: () => {
        this.level = 'success';
        this.message = 'Feedback added successfully!';
        this.resetForm();
        this.showForm = false;
        this.loadFeedbacks();
      },
      error: (err) => {
        this.level = 'danger';
        this.message = err.error?.error || 'Failed to submit feedback.';
        this.cdr.detectChanges();
      }
    });
  }

  resetForm(): void {
    this.feedbackRequest = {
      bookId: this.bookId,
      comment: '',
      score: 0
    };
  }

  onPageChange(newPage: number): void {
    this.page = newPage;
    this.loadFeedbacks();
  }
}
