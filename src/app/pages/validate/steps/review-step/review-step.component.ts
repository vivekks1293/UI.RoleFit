import { Component, input, output } from '@angular/core';
import { BaseResume } from '../../../../core/services/resume-session.service';

@Component({
  selector: 'app-review-step',
  standalone: true,
  imports: [],
  templateUrl: './review-step.component.html',
  styleUrls: ['./review-step.component.css'],
})
export class ReviewStepComponent {
  resume = input.required<BaseResume>();
  back    = output<void>();
  confirm = output<void>();
}