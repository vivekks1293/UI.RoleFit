import { Component, input, output, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BaseResume } from '../../../../core/services/resume-session.service';

@Component({
  selector: 'app-personal-info-step',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './personal-info-step.component.html',
  styleUrls: ['./personal-info-step.component.css'],
})
export class PersonalInfoStepComponent implements OnInit {
  resume = input.required<BaseResume>();

  personalChanged = output<Partial<BaseResume>>();
  contactChanged  = output<Partial<BaseResume['contact']>>();
  next = output<void>();

  // Local editable copies
  name     = signal('');
  summary  = signal('');
  email    = signal('');
  phone    = signal('');
  linkedin = signal('');
  location = signal('');

  ngOnInit(): void {
    const r = this.resume();
    this.name.set(r.name);
    this.summary.set(r.summary ?? '');
    this.email.set(r.contact.email);
    this.phone.set(r.contact.phone ?? '');
    this.linkedin.set(r.contact.linkedin ?? '');
    this.location.set(r.contact.location ?? '');
  }

  onNext(): void {
    this.personalChanged.emit({ name: this.name(), summary: this.summary() });
    this.contactChanged.emit({
      email: this.email(),
      phone: this.phone(),
      linkedin: this.linkedin(),
      location: this.location(),
    });
    this.next.emit();
  }
}