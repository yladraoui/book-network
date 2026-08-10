import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, Input } from '@angular/core';
import { PageResponseFeedbackResponse } from '../../../../services/models';
import { findAllFeedbacksByBook } from '../../../../services/functions';
import { HttpClient } from '@angular/common/http';
import { ApiConfiguration } from '../../../../services/api-configuration';
import { FeedbackCard } from '../../components/feedback-card/feedback-card';
import { Pagination } from '../../../../shared/components/pagination/pagination';

@Component({
  selector: 'app-feedback-list',
  imports: [CommonModule, FeedbackCard, Pagination],
  templateUrl: './feedback-list.html',
  styleUrl: './feedback-list.scss',
})
export class FeedbackList {
  @Input() bookId: number = 3;
  private http = inject(HttpClient);
  private config = inject(ApiConfiguration);
  private cdr = inject(ChangeDetectorRef);
  feedbackResponse: PageResponseFeedbackResponse ={
    content: [
      {
        comment: "I like this book and it soo beautiful",
        ownFeedback: false,
        score: 5
      },
      {
        comment: "I like this book and it soo beautiful",
        ownFeedback: false,
        score: 5
      },
      {
        comment: "I dont like this book and it soo beautiful",
        ownFeedback: false,
        score: 1
      },
      {
        comment: "I like this book and it soo beautiful",
        ownFeedback: false,
        score: 5
      },
    ],
    first: true,
    last: true,
    number : 1,
    size: 9,
    totalElements: 4,
    totalPages: 1
  }

  page = 0;
  size = 9;
 

  ngOnInit(): void {
    this.loadFeedbacks();
  }

  loadFeedbacks (): void{
    findAllFeedbacksByBook(
      this.http,
      this.config.rootUrl,
      {"book-id": this.bookId, page: this.page, size: this.size}
    ).subscribe({
      next: (res) => {
        //this.feedbackResponse = res.body || {}
        this.cdr.detectChanges();
      },
      error: (err) => console.log("Error while uploding feedbacks")
    })
  }

  onPageChange(newPage: number): void {
    this.page = newPage;
    this.loadFeedbacks();
    this.cdr.detectChanges();
  }
}
