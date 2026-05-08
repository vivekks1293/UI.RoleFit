import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseResume, JobDescription } from './resume-session.service';

export interface JobAnalysisResult {
  jobId: string;
  status: 'success' | 'invalid_jd' | 'error';
  matchScore: number;
  matchLevel: 'strong' | 'medium' | 'weak' | 'none';
  summary: string;
  jdSkills: string[];
  yourSkills: string[];
  gaps: string[];
  reason?: string;
}

export interface AnalyseResponse {
  results: JobAnalysisResult[];
}

@Injectable({ providedIn: 'root' })
export class JobAnalysisService {

  constructor(private http: HttpClient) {}

  analyse(
    resume: BaseResume,
    jobs: JobDescription[]
  ): Observable<AnalyseResponse> {

    const body = {
      resume,
      jobs: jobs.map(j => ({
        id: j.id,
        label: j.label,
        company: j.company,
        title: j.title,
        rawText: j.rawText,
        sourceUrl: j.sourceUrl ?? null,
      }))
    };

    return this.http.post<AnalyseResponse>('/api/jobs/analyse', body);
  }
}