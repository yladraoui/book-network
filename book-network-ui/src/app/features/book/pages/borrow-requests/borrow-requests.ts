import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { Pagination } from '../../../../shared/components/pagination/pagination';
import { Rating } from '../../components/rating/rating';
import { HttpClient } from '@angular/common/http';
import { approveBorrowRequest, findAllBorrowRequests } from '../../../../services/functions';
import { ApiConfiguration } from '../../../../services/api-configuration';
import { BorrowedBookResponse, PageResponseBorrowedBookResponse } from '../../../../services/models';

@Component({
  selector: 'app-borrow-requests',
  imports: [CommonModule, Pagination, Rating],
  templateUrl: './borrow-requests.html',
  styleUrl: './borrow-requests.scss',
})
export class BorrowRequests {
  private http = inject(HttpClient);
  private config = inject(ApiConfiguration);
  private cdr = inject(ChangeDetectorRef);

  borrowRequestsResponse: PageResponseBorrowedBookResponse = {};

  page = 0;
  size = 5;

  message = '';
  level: 'success' | 'danger' = 'success';

  ngOnInit(): void {
    this.loadBorrowRequests();
  }

  /**
   * Charge les demandes d'emprunt en attente via GET /books/borrow-requests
   */
  loadBorrowRequests(): void {
    findAllBorrowRequests(this.http, this.config.rootUrl, {
      page: this.page,
      size: this.size,
    }).subscribe({
      next: (res) => {
        this.borrowRequestsResponse = res.body || {};
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erreur lors du chargement des demandes d\'emprunt', err);
      },
    });
  }

  /**
   * Approuve une demande via PATCH /books/borrow/approve/{history-id}
   */
  approveRequest(book: BorrowedBookResponse): void {
    if (!book.id) return;
    this.message = '';

    approveBorrowRequest(this.http, this.config.rootUrl, {
      'history-id': book.id, // Corrected parameter name matching backend controller path variable
    }).subscribe({
      next: () => {
        this.level = 'success';
        this.message = `Demande d'emprunt pour le livre "${book.title || 'Sans titre'}" approuvée avec succès !`;
        this.loadBorrowRequests();
      },
      error: (err) => {
        this.level = 'danger';
        this.message = err.error?.error || 'Échec lors de l\'approbation de la demande.';
        this.cdr.detectChanges();
      },
    });
  }

  /**
   * Gestion du changement de page
   */
  onPageChange(newPage: number): void {
    this.page = newPage;
    this.loadBorrowRequests();
  }
}
