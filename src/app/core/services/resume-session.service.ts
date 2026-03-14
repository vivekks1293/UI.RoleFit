import { Injectable, signal, computed } from '@angular/core';

// ─── Data Models ────────────────────────────────────────────────────────────

export interface ContactInfo {
  email: string;
  phone?: string;
  linkedin?: string;
  location?: string;
}

export interface ExperienceEntry {
  id: string;
  company: string;
  title: string;
  startDate: string;
  endDate: string | null; // null = present
  bullets: string[];
}

export interface EducationEntry {
  id: string;
  institution: string;
  degree: string;
  field: string;
  graduationYear: string;
}

export interface BaseResume {
  name: string;
  contact: ContactInfo;
  summary: string | null;
  skills: string[];
  experience: ExperienceEntry[];
  education: EducationEntry[];
  /** 0–1 confidence score; lower for PDF-parsed resumes */
  parseConfidence: number;
  /** Original file reference for display purposes */
  sourceFile: File | null;
}

export interface JobDescription {
  id: string;
  title: string;
  company: string;
  rawText: string;
  sourceUrl?: string;
  addedAt: Date;
}

export interface TailoredResume {
  jobId: string;
  resume: BaseResume;
  generatedAt: Date;
}

// ─── Service ─────────────────────────────────────────────────────────────────

@Injectable({ providedIn: 'root' })
export class ResumeSessionService {
  // ── Raw upload ──────────────────────────────────────────────
  private _uploadedFile = signal<File | null>(null);
  readonly uploadedFile = this._uploadedFile.asReadonly();

  // ── Parsed + validated base resume ─────────────────────────
  private _baseResume = signal<BaseResume | null>(null);
  readonly baseResume = this._baseResume.asReadonly();

  // ── Job descriptions ────────────────────────────────────────
  private _jobDescriptions = signal<JobDescription[]>([]);
  readonly jobDescriptions = this._jobDescriptions.asReadonly();

  // ── Tailored variants ───────────────────────────────────────
  private _tailoredResumes = signal<TailoredResume[]>([]);
  readonly tailoredResumes = this._tailoredResumes.asReadonly();

  // ── Derived state ───────────────────────────────────────────
  readonly hasResume = computed(() => this._baseResume() !== null);
  readonly jobCount   = computed(() => this._jobDescriptions().length);
  readonly isReady    = computed(() => this.hasResume() && this.jobCount() > 0);

  // ── Methods ─────────────────────────────────────────────────

  setUploadedFile(file: File): void {
    this._uploadedFile.set(file);
  }

  setBaseResume(resume: BaseResume): void {
    this._baseResume.set(resume);
  }

  updateBaseResume(partial: Partial<BaseResume>): void {
    const current = this._baseResume();
    if (!current) return;
    this._baseResume.set({ ...current, ...partial });
  }

  addJobDescription(job: Omit<JobDescription, 'id' | 'addedAt'>): void {
    const entry: JobDescription = {
      ...job,
      id: crypto.randomUUID(),
      addedAt: new Date(),
    };
    this._jobDescriptions.update((jobs) => [...jobs, entry]);
  }

  removeJobDescription(id: string): void {
    this._jobDescriptions.update((jobs) => jobs.filter((j) => j.id !== id));
  }

  addTailoredResume(tailored: TailoredResume): void {
    this._tailoredResumes.update((list) => [...list, tailored]);
  }

  reset(): void {
    this._uploadedFile.set(null);
    this._baseResume.set(null);
    this._jobDescriptions.set([]);
    this._tailoredResumes.set([]);
  }
}
