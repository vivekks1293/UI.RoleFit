import { Injectable, signal, computed } from '@angular/core';

// ─── Data Models ─────────────────────────────────────────────────────────────

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
  endDate: string | null;
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
  parseConfidence: number;
  sourceFile: File | null;
}

export interface JobDescription {
  id: string;
  label: string;       // e.g. "Google — L5 SWE" — used for resume filename
  title: string;       // job title
  company: string;     // company name
  rawText: string;     // pasted JD text
  sourceUrl?: string;  // URL (future use)
  addedAt: Date;
}

export interface TailoredResume {
  jobId: string;
  resume: BaseResume;
  generatedAt: Date;
}

// ─── Service ──────────────────────────────────────────────────────────────────

@Injectable({ providedIn: 'root' })
export class ResumeSessionService {

  private _uploadedFile    = signal<File | null>(null);
  private _baseResume      = signal<BaseResume | null>(null);
  private _jobDescriptions = signal<JobDescription[]>([]);
  private _tailoredResumes = signal<TailoredResume[]>([]);

  readonly uploadedFile    = this._uploadedFile.asReadonly();
  readonly baseResume      = this._baseResume.asReadonly();
  readonly jobDescriptions = this._jobDescriptions.asReadonly();
  readonly tailoredResumes = this._tailoredResumes.asReadonly();

  readonly hasResume  = computed(() => this._baseResume() !== null);
  readonly jobCount   = computed(() => this._jobDescriptions().length);
  readonly isReady    = computed(() => this.hasResume() && this.jobCount() > 0);

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
    this._jobDescriptions.update(jobs => [...jobs, entry]);
  }

  updateJobDescription(id: string, patch: Partial<JobDescription>): void {
    this._jobDescriptions.update(jobs =>
      jobs.map(j => j.id === id ? { ...j, ...patch } : j)
    );
  }

  removeJobDescription(id: string): void {
    this._jobDescriptions.update(jobs => jobs.filter(j => j.id !== id));
  }

  clearJobDescriptions(): void {
    this._jobDescriptions.set([]);
  }

  addTailoredResume(tailored: TailoredResume): void {
    this._tailoredResumes.update(list => [...list, tailored]);
  }

  reset(): void {
    this._uploadedFile.set(null);
    this._baseResume.set(null);
    this._jobDescriptions.set([]);
    this._tailoredResumes.set([]);
  }
}