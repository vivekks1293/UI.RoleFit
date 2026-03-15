import { Component, OnInit, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { ResumeSessionService, BaseResume, ExperienceEntry, EducationEntry } from '../../core/services/resume-session.service';
import { MockResumeService } from '../../core/services/mock-resume.service';
import { PersonalInfoStepComponent } from './steps/personal-info-step/personal-info-step.component';
import { ExperienceStepComponent } from './steps/experience-step/experience-step.component';
import { SkillsEducationStepComponent } from './steps/skills-education-step/skills-education-step.component';
import { ReviewStepComponent } from './steps/review-step/review-step.component';

export interface ValidationStep {
  id: number;
  label: string;
  shortLabel: string;
}

export const VALIDATION_STEPS: ValidationStep[] = [
  { id: 0, label: 'Personal info',    shortLabel: 'Personal' },
  { id: 1, label: 'Experience',       shortLabel: 'Experience' },
  { id: 2, label: 'Skills & Education', shortLabel: 'Skills' },
  { id: 3, label: 'Review & Confirm', shortLabel: 'Review' },
];

@Component({
  selector: 'app-validate',
  standalone: true,
  imports: [
    PersonalInfoStepComponent,
    ExperienceStepComponent,
    SkillsEducationStepComponent,
    ReviewStepComponent
  ],
  templateUrl: './validate.component.html',
  styleUrls: ['./validate.component.css'],
})
export class ValidateComponent implements OnInit {
  steps = VALIDATION_STEPS;
  currentStep = signal(0);
  isLastStep = computed(() => this.currentStep() === this.steps.length - 1);
  isFirstStep = computed(() => this.currentStep() === 0);

  // Working copy of the resume — edits happen here before confirm
  resume = signal<BaseResume | null>(null);

  constructor(
    private router: Router,
    private session: ResumeSessionService,
    private mock: MockResumeService,
  ) {}

  ngOnInit(): void {
    // Use session resume if available, otherwise fall back to mock
    const sessionResume = this.session.baseResume();
    this.resume.set(sessionResume ?? this.mock.getMockResume());
  }

  // ── Step navigation ───────────────────────────────────────────
  goNext(): void {
    if (!this.isLastStep()) {
      this.currentStep.update(s => s + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  goBack(): void {
    if (!this.isFirstStep()) {
      this.currentStep.update(s => s - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      this.router.navigate(['/upload-resume']);
    }
  }

  goToStep(index: number): void {
    // Only allow jumping to already-visited steps (index <= current)
    if (index <= this.currentStep()) {
      this.currentStep.set(index);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  // ── Patch helpers (called by child step components via output) ─
  patchPersonal(patch: Partial<BaseResume>): void {
    const current = this.resume();
    if (!current) return;
    this.resume.set({ ...current, ...patch });
  }

  patchContact(patch: Partial<BaseResume['contact']>): void {
    const current = this.resume();
    if (!current) return;
    this.resume.set({
      ...current,
      contact: { ...current.contact, ...patch },
    });
  }

  patchExperience(entries: ExperienceEntry[]): void {
    const current = this.resume();
    if (!current) return;
    this.resume.set({ ...current, experience: entries });
  }

  patchSkills(skills: string[]): void {
    const current = this.resume();
    if (!current) return;
    this.resume.set({ ...current, skills });
  }

  patchEducation(education: EducationEntry[]): void {
    const current = this.resume();
    if (!current) return;
    this.resume.set({ ...current, education });
  }

  // ── Final confirm ─────────────────────────────────────────────
  onConfirm(): void {
    const final = this.resume();
    if (!final) return;
    this.session.setBaseResume(final);
    // TODO: navigate to /jobs once that page is built
    this.router.navigate(['/']);
  }
}