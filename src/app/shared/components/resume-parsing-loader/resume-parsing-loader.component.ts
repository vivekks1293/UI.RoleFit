import {
  Component,
  OnInit,
  OnDestroy,
  signal,
  computed,
  input,
  output,
} from '@angular/core';
import { DecimalPipe } from '@angular/common';

export interface ResumeFact {
  headline: string;
  detail: string;
}

// ── Fact bank ────────────────────────────────────────────────────────────────
// Replace these with facts fetched from the Python backend once the API exists.
// Shape expected from backend: Array<{ headline: string; detail: string }>
const RESUME_FACTS: ResumeFact[] = [
  {
    headline: 'ATS filters out ~75% of resumes',
    detail:
      'Most large companies use Applicant Tracking Systems that auto-reject resumes before a human ever sees them.',
  },
  {
    headline: 'Keywords are everything',
    detail:
      'ATS software scores your resume by matching words directly from the job description. Missing a key term can mean instant rejection.',
  },
  {
    headline: 'One page vs two pages',
    detail:
      'For under 10 years of experience, recruiters prefer a single page. Beyond that, two pages is standard — never three.',
  },
  {
    headline: 'Recruiters spend ~7 seconds on first scan',
    detail:
      'Eye-tracking studies show recruiters look at name, current title, company, dates, and education — in that order.',
  },
  {
    headline: 'Quantified bullets get more callbacks',
    detail:
      '"Reduced load time by 40%" outperforms "Improved performance" every time. Numbers make achievements concrete and credible.',
  },
  {
    headline: 'Tailored resumes are 3x more effective',
    detail:
      'Sending a generic resume to every role is the single biggest mistake job seekers make. Tailoring is not optional.',
  },
  {
    headline: 'File format matters more than you think',
    detail:
      'DOCX parses cleanly in most ATS. PDFs can confuse older systems. Never submit a scanned image — it is completely invisible to ATS.',
  },
  {
    headline: 'Your email address is still judged',
    detail:
      'Recruiters do notice unprofessional email addresses. firstname.lastname@gmail.com is the safest choice.',
  },
];

// ── Parsing steps shown in the progress bar ──────────────────────────────────
const PARSING_STEPS = [
  'Reading document structure…',
  'Extracting sections…',
  'Identifying experience entries…',
  'Parsing skills and education…',
  'Structuring data…',
  'Finalising…',
];

@Component({
  selector: 'app-resume-parsing-loader',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './resume-parsing-loader.component.html',
  styleUrls: ['./resume-parsing-loader.component.css'],
})
export class ResumeParsingLoaderComponent implements OnInit, OnDestroy {
  // ── Inputs / Outputs ──────────────────────────────────────────────────────
  fileName = input<string>('');
  fileType = input<string>('');
  /** Emit when parsing is complete so the parent can navigate away */
  parsed = output<void>();

  // ── State ─────────────────────────────────────────────────────────────────
  currentFactIndex = signal(0);
  currentStepIndex = signal(0);
  progressPercent = signal(0);
  isExiting = signal(false);

  currentFact = computed(() => RESUME_FACTS[this.currentFactIndex()]);
  currentStep = computed(() => PARSING_STEPS[this.currentStepIndex()]);
  facts = RESUME_FACTS;

  private factTimer: ReturnType<typeof setInterval> | null = null;
  private stepTimer: ReturnType<typeof setInterval> | null = null;
  private progressTimer: ReturnType<typeof setInterval> | null = null;

  ngOnInit(): void {
    this.startFactRotation();
    this.startProgressSimulation();
  }

  ngOnDestroy(): void {
    this.clearTimers();
  }

  private startFactRotation(): void {
    // Rotate fact every 4 seconds
    this.factTimer = setInterval(() => {
      this.currentFactIndex.update(
        (i) => (i + 1) % RESUME_FACTS.length
      );
    }, 4000);
  }

  private startProgressSimulation(): void {
    const totalDuration = 6000; // 6 seconds simulated parse time
    const stepDuration = totalDuration / PARSING_STEPS.length;
    const tickInterval = 80; // ms per tick
    const progressPerTick = 100 / (totalDuration / tickInterval);

    this.progressTimer = setInterval(() => {
      this.progressPercent.update((p) => {
        const next = Math.min(p + progressPerTick, 97); // stop at 97, wait for real API
        return next;
      });
    }, tickInterval);

    // Advance step label
    this.stepTimer = setInterval(() => {
      this.currentStepIndex.update((i) =>
        Math.min(i + 1, PARSING_STEPS.length - 1)
      );
    }, stepDuration);

    // Simulate completion after totalDuration
    // TODO: Replace with real API call result
    setTimeout(() => {
      this.completeLoading();
    }, totalDuration);
  }

  private completeLoading(): void {
    this.clearTimers();
    this.progressPercent.set(100);
    this.currentStepIndex.set(PARSING_STEPS.length - 1);

    // Brief pause at 100% then emit done
    setTimeout(() => {
      this.isExiting.set(true);
      setTimeout(() => {
        this.parsed.emit();
      }, 500);
    }, 600);
  }

  private clearTimers(): void {
    if (this.factTimer)    clearInterval(this.factTimer);
    if (this.stepTimer)    clearInterval(this.stepTimer);
    if (this.progressTimer) clearInterval(this.progressTimer);
  }

  selectFact(index: number): void {
    this.currentFactIndex.set(index);
  }
}