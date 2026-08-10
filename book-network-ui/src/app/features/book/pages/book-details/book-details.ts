import { CommonModule } from '@angular/common';
import { Component, Input, Output } from '@angular/core';
import { FeedbackCard } from '../../../feedback/components/feedback-card/feedback-card';
import { FeedbackList } from '../../../feedback/pages/feedback-list/feedback-list';
import { BookResponse } from '../../../../services/models';

@Component({
  selector: 'app-book-details',
  imports: [CommonModule, FeedbackList],
  templateUrl: './book-details.html',
  styleUrl: './book-details.scss',
})
export class BookDetails {

  @Input() book: BookResponse = {};

  
  get bookId(): number {
    return this.book?.id ?? 2;
  }

  
  get fullStars(): number[] {
    return Array(Math.floor(this.book?.rate || 0)).fill(0);
  }

  get emptyStars(): number[] {
    return Array(5 - Math.floor(this.book?.rate || 0)).fill(0);
  }
}
