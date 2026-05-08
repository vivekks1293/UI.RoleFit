
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseResume } from './resume-session.service';
import { JobAnalysisResult } from './job.service';

// ── Request / Response models ─────────────────────────────────────────────────

export interface TailorJobInput {
  id: string;
  label: string;
  company: string;
  title: string;
  rawText: string;
}

export interface TailorAnalysisHints {
  jdSkills: string[];
  gaps: string[];
  matchLevel: string;
}

export interface TailorRequest {
  resume: BaseResume;
  job: TailorJobInput;
  analysis: TailorAnalysisHints;
}

export interface TailorResponse {
  jobId: string;
  tailoredResume: BaseResume;
}

// ── Service ───────────────────────────────────────────────────────────────────

@Injectable({ providedIn: 'root' })
export class TailorService {

  constructor(private http: HttpClient) {}

  tailor(
    resume: BaseResume,
    job: TailorJobInput,
    analysis: JobAnalysisResult
  ): Observable<TailorResponse> {

    const body: TailorRequest = {
      resume,
      job,
      analysis: {
        jdSkills:   analysis.jdSkills,
        gaps:       analysis.gaps,
        matchLevel: analysis.matchLevel,
      }
    };

    return this.http.post<TailorResponse>('/api/tailor/resume', body);
  }
}