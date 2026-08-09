import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  imports: [CommonModule],
  templateUrl: './pagination.html',
  styleUrl: './pagination.scss',
})
export class Pagination {
  @Input() page = 0;           // Index de la page courante (commence à 0)
  @Input() totalPages = 0;     // Nombre total de pages
  @Input() isFirst = true;     // Est-ce la première page ?
  @Input() isLast = true;      // Est-ce la dernière page ?

  @Output() pageChange = new EventEmitter<number>();

  /**
   * Génère le tableau des numéros de pages à afficher.
   * Affiche jusqu'à 5 pages autour de la page courante.
   */
  get pages(): number[] {
    const pagesArray: number[] = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(0, this.page - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(this.totalPages - 1, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(0, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pagesArray.push(i);
    }

    return pagesArray;
  }

  goToPage(pageIndex: number): void {
    if (pageIndex >= 0 && pageIndex < this.totalPages && pageIndex !== this.page) {
      this.pageChange.emit(pageIndex);
    }
  }

  goToFirst(): void {
    if (!this.isFirst) {
      this.pageChange.emit(0);
    }
  }

  goToPrevious(): void {
    if (!this.isFirst) {
      this.pageChange.emit(this.page - 1);
    }
  }

  goToNext(): void {
    if (!this.isLast) {
      this.pageChange.emit(this.page + 1);
    }
  }

  goToLast(): void {
    if (!this.isLast) {
      this.pageChange.emit(this.totalPages - 1);
    }
  }
}
