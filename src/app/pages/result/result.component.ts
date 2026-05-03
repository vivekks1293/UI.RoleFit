import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ResumeSessionService } from '../../core/services/resume-session.service';
import { JobAnalysisResult } from '../../core/services/job.service';

export type CardStatus = 'idle' | 'tailoring' | 'tailored' | 'error';
export type MatchLevel  = 'strong' | 'medium' | 'weak' | 'none';

export interface ResultCard {
  jobId:        string;
  label:        string;
  company:      string;
  title:        string;
  status:       CardStatus;
  isValidJD:    boolean;
  matchScore:   number;
  matchLevel:   MatchLevel;
  summary:      string;
  jdSkills:     string[];
  yourSkills:   string[];
  gaps:         string[];
  reason?:      string;
  tailoredResume?: any;
}

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [],
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css'],
})
export class ResultsComponent implements OnInit {

  cards = signal<ResultCard[]>([]);

  constructor(
    private router: Router,
    private session: ResumeSessionService,
  ) {}

  ngOnInit(): void {
    const jobs    = this.session.jobDescriptions();
    const results = this.session.analysisResults();

    if (!results || results.length === 0) {
      // No results in session — go back to jobs page
      this.router.navigate(['/jobs']);
      return;
    }

    // Map analysis results to card model
    // Match each result to its job by jobId to get label/company/title
    const cards: ResultCard[] = results.map(result => {
      const job = jobs.find(j => j.id === result.jobId);

      return {
        jobId:      result.jobId,
        label:      job?.label   ?? result.jobId,
        company:    job?.company ?? '',
        title:      job?.title   ?? '',
        status:     'idle' as CardStatus,
        isValidJD:  result.status === 'success',
        matchScore: result.matchScore,
        matchLevel: result.matchLevel as MatchLevel,
        summary:    result.summary,
        jdSkills:   result.jdSkills,
        yourSkills: result.yourSkills,
        gaps:       result.gaps,
        reason:     result.reason,
      };
    });

    this.cards.set(cards);
  }

  onEditJob(): void {
    this.router.navigate(['/jobs']);
  }

  onTailor(card: ResultCard): void {
    // TODO: call /api/jobs/tailor in next step
    this.updateCard(card.jobId, { status: 'tailoring' });
    console.log('Tailor triggered for:', card.label);
  }

  onVerifyEdit(card: ResultCard): void {
    // TODO: open verify & edit modal in next step
    console.log('Verify & Edit:', card.label);
  }

  onDownload(card: ResultCard): void {
    // TODO: call /api/resume/download in next step
    console.log('Download:', card.label);
  }

  onBack(): void {
    this.router.navigate(['/jobs']);
  }

  private updateCard(jobId: string, patch: Partial<ResultCard>): void {
    this.cards.update(list =>
      list.map(c => c.jobId === jobId ? { ...c, ...patch } : c)
    );
  }

  get validCount(): number {
    return this.cards().filter(c => c.isValidJD).length;
  }

  get invalidCount(): number {
    return this.cards().filter(c => !c.isValidJD).length;
  }

  scoreColor(level: MatchLevel): string {
    switch (level) {
      case 'strong': return 'var(--color-accent)';
      case 'medium': return '#f59e0b';
      case 'weak':   return '#f97316';
      case 'none':   return '#6b7280';
    }
  }

  scoreBg(level: MatchLevel): string {
    switch (level) {
      case 'strong': return 'rgba(92, 255, 228, 0.06)';
      case 'medium': return 'rgba(245, 158, 11, 0.06)';
      case 'weak':   return 'rgba(249, 115, 22, 0.06)';
      case 'none':   return 'rgba(107, 114, 128, 0.06)';
    }
  }

  scoreBorder(level: MatchLevel): string {
    switch (level) {
      case 'strong': return 'rgba(92, 255, 228, 0.18)';
      case 'medium': return 'rgba(245, 158, 11, 0.18)';
      case 'weak':   return 'rgba(249, 115, 22, 0.18)';
      case 'none':   return 'rgba(107, 114, 128, 0.18)';
    }
  }

  matchLabel(level: MatchLevel): string {
    switch (level) {
      case 'strong': return 'Strong match';
      case 'medium': return 'Medium match';
      case 'weak':   return 'Weak match';
      case 'none':   return 'No match';
    }
  }
}