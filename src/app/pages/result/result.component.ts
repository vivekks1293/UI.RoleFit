import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ResumeSessionService } from '../../core/services/resume-session.service';
import { JobAnalysisResult } from '../../core/services/job.service';
import { TailorService } from '../../core/services/tailor.service';
import { ToastService } from '../../core/services/Toast.service';

export type CardStatus = 'idle' | 'tailoring' | 'tailored' | 'error';
export type MatchLevel  = 'strong' | 'medium' | 'weak' | 'none';

export interface ResultCard {
  jobId:        string;
  label:        string;
  company:      string;
  title:        string;
  rawText:      string;       // original JD text — used for tailoring
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
    private tailorService: TailorService,
    private toast: ToastService,
  ) {}

  ngOnInit(): void {
    const jobs    = this.session.jobDescriptions();
    const results = this.session.analysisResults();

    if (!results || results.length === 0) {
      this.router.navigate(['/jobs']);
      return;
    }

    const cards: ResultCard[] = results.map(result => {
      const job = jobs.find(j => j.id === result.jobId);
      return {
        jobId:      result.jobId,
        label:      job?.label    ?? result.jobId,
        company:    job?.company  ?? '',
        title:      job?.title    ?? '',
        rawText:    job?.rawText  ?? '',   // ← original JD text preserved
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

  // ── Tailor ────────────────────────────────────────────────────────────────

  onTailor(card: ResultCard): void {
    const baseResume = this.session.baseResume();

    if (!baseResume) {
      this.toast.error('Resume not found', 'Please restart the process.');
      return;
    }

    // Set spinner on this card only
    this.updateCard(card.jobId, { status: 'tailoring' });

    // Get the analysis result for this job from session
    const analysisResult = this.session.analysisResults()
      .find(r => r.jobId === card.jobId);

    if (!analysisResult) {
      this.toast.error('Analysis not found', 'Please re-analyse your jobs.');
      this.updateCard(card.jobId, { status: 'idle' });
      return;
    }

    this.tailorService.tailor(
      baseResume,
      {
        id:      card.jobId,
        label:   card.label,
        company: card.company,
        title:   card.title,
        rawText: card.rawText,    // ← original JD text, not the analysis summary
      },
      analysisResult
    ).subscribe({
      next: (response) => {
        this.updateCard(card.jobId, {
          status: 'tailored',
          tailoredResume: response.tailoredResume,
        });
        this.toast.success(
          'Resume tailored',
          `${card.label} is ready to download.`
        );
      },
      error: (err) => {
        console.error('Tailor failed:', err);
        this.updateCard(card.jobId, { status: 'error' });
        this.toast.error(
          'Tailoring failed',
          'Something went wrong. Please try again.'
        );
      }
    });
  }

  // ── Other actions ─────────────────────────────────────────────────────────

  onEditJob(): void {
    this.router.navigate(['/jobs']);
  }

  onVerifyEdit(card: ResultCard): void {
    // TODO: open verify & edit modal — next step
    console.log('Verify & Edit:', card.label);
  }

  onDownload(card: ResultCard): void {
    // TODO: call /api/resume/download — next step
    console.log('Download:', card.label, card.tailoredResume);
  }

  onBack(): void {
    this.router.navigate(['/jobs']);
  }

  // ── Helpers ───────────────────────────────────────────────────────────────

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