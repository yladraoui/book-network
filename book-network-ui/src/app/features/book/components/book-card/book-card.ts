import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Rating } from '../rating/rating';
import { BookResponse } from '../../../../services/models';

@Component({
  selector: 'app-book-card',
  imports: [CommonModule, Rating],
  templateUrl: './book-card.html',
  styleUrl: './book-card.scss',
})
export class BookCard {
  @Input() book: BookResponse = {};
  @Input() isManageMode = false;

  @Output() borrow = new EventEmitter<BookResponse>();
  @Output() archive = new EventEmitter<BookResponse>();
  @Output() shareable = new EventEmitter<BookResponse>();
  @Output() edit = new EventEmitter<BookResponse>();
  @Output() details = new EventEmitter<BookResponse>();

  get coverImage(): string {
    if (this.book.cover) {
      return 'data:image/jpg;base64,' + this.book.cover;
    }
    return 'assets/images/default-cover.png';
  }

  onBorrow(): void {
    this.borrow.emit(this.book);
  }

  onArchive(): void {
    this.archive.emit(this.book);
  }

  onShareable(): void {
    this.shareable.emit(this.book);
  }

  onEdit(): void {
    this.edit.emit(this.book);
  }

  onDetails(): void {
    this.details.emit(this.book);
  }
}
