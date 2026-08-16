import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Rating } from '../../../book/components/rating/rating';
import { FeedbackResponse } from '../../../../services/models';

@Component({
  selector: 'app-feedback-card',
  imports: [CommonModule, Rating],
  templateUrl: './feedback-card.html',
  styleUrl: './feedback-card.scss',
})
export class FeedbackCard {
  @Input() feedback: FeedbackResponse = {
    comment: "It's a beautiful book and i like it soo match, thank you soo mutch.",
    ownFeedback: false,
    score: 3.5
  };
}
