import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiConfiguration } from '../../../../services/api-configuration';
import { BookRequest } from '../../../../services/models';
import { findBookById, saveBook, uploadBookCoverPicture } from '../../../../services/functions';
import { handleApiError } from '../../../../core/utils/error-handler.utils';
import { mapValidationErrors } from '../../../../shared/utils/validation-err-messages';

@Component({
  selector: 'app-manage-book',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './manage-book.html',
  styleUrl: './manage-book.scss',
})
export class ManageBook implements OnInit{
 private http = inject(HttpClient);
  private config = inject(ApiConfiguration);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);

  bookRequest: BookRequest = {
    title: '',
    authorName: '',
    isbn: '',
    synopsis: '',
    shareable: false
  };

  selectedBookCover: File | null = null;
  selectedPicture: string | null = null;
  errorMsg: string[] = [];

  ngOnInit(): void {
    const bookId = this.route.snapshot.params['id'];
    if (bookId) {
      findBookById(this.http, this.config.rootUrl, { 'book-id': +bookId }).subscribe({
        next: (res) => {
          const book = res.body;
          if (book) {
            this.bookRequest = {
              id: book.id,
              title: book.title || '',
              authorName: book.authorName || '',
              isbn: book.isbn || '',
              synopsis: book.synopsis || '',
              shareable: book.shareable || false
            };
            if (book.cover) {
              this.selectedPicture = 'data:image/jpg;base64,' + book.cover;
            }
          }
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Error while uploading books', err)
      });
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.[0]) {
      this.selectedBookCover = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.selectedPicture = reader.result as string; 
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(this.selectedBookCover);
    }
  }

  saveBook(): void {
    this.errorMsg = [];
    saveBook(this.http, this.config.rootUrl, { body: this.bookRequest }).subscribe({
      next: (res) => {
        const savedBookId = res.body;
        if (this.selectedBookCover && savedBookId) {
          this.uploadCover(savedBookId);
        } else {
          this.router.navigate(['/books/my-books']);
        }
      },
      error: (err) => {
        const error = handleApiError(err);
        this.errorMsg = mapValidationErrors( error);
        this.cdr.detectChanges();
      }
    });
  }

  private uploadCover(bookId: number): void {
    if (!this.selectedBookCover) return;

    uploadBookCoverPicture(this.http, this.config.rootUrl, {
      'book-id': bookId,
      body: { file: this.selectedBookCover }
    }).subscribe({
      next: () => this.router.navigate(['/books/my-books']),
      error: (err) => console.error('Error while uploding the image', err)
    });
  }
}
