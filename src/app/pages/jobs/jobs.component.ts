import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  ResumeSessionService,
  JobDescription,
} from '../../core/services/resume-session.service';

// Local form model — separate from the session model
// so the user can edit freely before saving
export interface JobForm {
  formId: string;   // local ID for tracking in the UI
  label: string;
  company: string;
  title: string;
  rawText: string;
  sourceUrl: string;
  touched: boolean; // true once user has interacted
}

function emptyForm(): JobForm {
  return {
    formId: crypto.randomUUID(),
    label: '',
    company: '',
    title: '',
    rawText: '',
    sourceUrl: '',
    touched: false,
  };
}

@Component({
  selector: 'app-jobs',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.css'],
})
export class JobsComponent implements OnInit {
  forms = signal<JobForm[]>([emptyForm()]);
  isSubmitting = signal(false);

  constructor(
    private router: Router,
    private session: ResumeSessionService,
  ) {}

  ngOnInit(): void {
    // If session already has jobs (user came back), pre-populate
    const existing = this.session.jobDescriptions();
    if (existing.length > 0) {
      this.forms.set(
        existing.map(j => ({
          formId: j.id,
          label: j.label,
          company: j.company,
          title: j.title,
          rawText: j.rawText,
          sourceUrl: j.sourceUrl ?? '',
          touched: true,
        }))
      );
    }
  }

  // ── Form management ───────────────────────────────────────────────────────

  addForm(): void {
    this.forms.update(list => [...list, emptyForm()]);
    // Scroll to bottom after render
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }, 50);
  }

  removeForm(formId: string): void {
    if (this.forms().length === 1) return; // always keep at least one
    this.forms.update(list => list.filter(f => f.formId !== formId));
  }

  updateForm(formId: string, field: keyof JobForm, value: string): void {
    this.forms.update(list =>
      list.map(f =>
        f.formId === formId ? { ...f, [field]: value, touched: true } : f
      )
    );
  }

  // ── Validation ────────────────────────────────────────────────────────────

  isFormValid(form: JobForm): boolean {
    return (
      form.label.trim().length > 0 &&
      form.rawText.trim().length > 0
    );
  }

  get allValid(): boolean {
    return this.forms().every(f => this.isFormValid(f));
  }

  get validCount(): number {
    return this.forms().filter(f => this.isFormValid(f)).length;
  }

  // ── Navigation ────────────────────────────────────────────────────────────

  onBack(): void {
    this.router.navigate(['/validate']);
  }

  onSubmit(): void {
    if (!this.allValid || this.isSubmitting()) return;

    this.isSubmitting.set(true);

    // Clear existing jobs and save fresh list
    this.session.clearJobDescriptions();

    this.forms().forEach(form => {
      if (this.isFormValid(form)) {
        this.session.addJobDescription({
          label: form.label.trim(),
          company: form.company.trim(),
          title: form.title.trim(),
          rawText: form.rawText.trim(),
          sourceUrl: form.sourceUrl.trim() || undefined,
        });
      }
    });

    // TODO: navigate to /results once built
    // For now navigate to a placeholder
    this.router.navigate(['/results']);
  }
}