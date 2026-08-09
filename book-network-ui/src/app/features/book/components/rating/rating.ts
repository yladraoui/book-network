import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-rating',
  imports: [CommonModule],
  templateUrl: './rating.html',
  styleUrl: './rating.scss',
})
export class Rating {
@Input() rating: number = 0;

  get fullStars(): number[] {
    return Array(Math.floor(this.rating)).fill(0);
  }

  get hasHalfStar(): boolean {
    return this.rating % 1 >= 0.5;
  }

  get emptyStars(): number[] {
    const filled = this.fullStars.length + (this.hasHalfStar ? 1 : 0);
    return Array(Math.max(0, 5 - filled)).fill(0);
  }
}