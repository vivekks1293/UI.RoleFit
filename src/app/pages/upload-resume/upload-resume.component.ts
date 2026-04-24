import { Component, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { ResumeParsingLoaderComponent } from '../../shared/components/resume-parsing-loader/resume-parsing-loader.component';
import { ResumeParserService } from '../../core/services/resume-parser.service';
import { ToastService } from '../../core/services/Toast.service';
type UploadState = 'idle' | 'hovering' | 'selected' | 'error' | 'parsing';
type ParsingState = 'error' | 'parsing' | 'completed' | 'idle';
import { ResumeSessionService} from '../../core/services/resume-session.service';

@Component({
  selector: 'app-upload-resume',
  standalone: true,
  imports: [ResumeParsingLoaderComponent],
  templateUrl: './upload-resume.component.html',
  styleUrls: ['./upload-resume.component.css'],
})
export class UploadResumeComponent {
  uploadState = signal<UploadState>('idle');
  selectedFile = signal<File | null>(null);
  errorMessage = signal<string>('');
  resumeParsingStatus: ParsingState = "idle"

  readonly acceptedTypes = [
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
    'application/pdf',
  ];
  readonly acceptedExtensions = '.docx,.pdf';
  readonly maxSizeMB = 10;

  fileName = computed(() => this.selectedFile()?.name ?? '');
  fileSizeMB = computed(() => {
    const f = this.selectedFile();
    return f ? (f.size / 1024 / 1024).toFixed(2) : '0';
  });
  fileType = computed(() => {
    const name = this.fileName().toLowerCase();
    if (name.endsWith('.docx')) return 'DOCX';
    if (name.endsWith('.pdf')) return 'PDF';
    return '';
  });

  constructor(private toastService: ToastService, private router: Router, private resumeParser: ResumeParserService, private resumeBaseService: ResumeSessionService,) {}

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.uploadState.set('hovering');
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.uploadState.set('idle');
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer?.files?.[0];
    if (file) this.handleFile(file);
  }

  onFileInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) this.handleFile(file);
    input.value = '';
  }

  private handleFile(file: File): void {
    // Validate type
    if (!this.acceptedTypes.includes(file.type) &&
        !file.name.endsWith('.docx') &&
        !file.name.endsWith('.pdf')) {
      this.uploadState.set('error');
      this.errorMessage.set('Only DOCX and PDF files are supported.');
      return;
    }
    // Validate size
    if (file.size > this.maxSizeMB * 1024 * 1024) {
      this.uploadState.set('error');
      this.errorMessage.set(`File is too large. Maximum size is ${this.maxSizeMB}MB.`);
      return;
    }
    this.selectedFile.set(file);
    this.uploadState.set('selected');
    this.errorMessage.set('');
  }

  removeFile(): void {
    this.selectedFile.set(null);
    this.uploadState.set('idle');
    this.errorMessage.set('');
  }

  onContinue(): void {
    if (!this.selectedFile()) return;
    const file: any = this.selectedFile();
    this.uploadState.set('parsing');
    this.resumeBaseService.reset();
    this.resumeParsingStatus = "parsing";
    this.resumeParser.parse(file).subscribe({
      next: (res)=>{
        this.resumeBaseService.setBaseResume(res);
        this.resumeParsingStatus = "completed";
        this.toastService.success("Resume Parsing Success", '', 6000)
      },
      error: (err)=>{
        this.uploadState.set('error');
        this.resumeParsingStatus = "error";
        this.toastService.error("Resume Parsing Error", "Something went wrong while parsing your resume", 6000)
        this.router.navigate(['/upload-resume']);

      },
      complete: ()=>{
        this.router.navigate(['/validate']);
        // this.resumeBaseService.reset()
      }
    })
  }

  /** Called by the loader component when parsing is complete */
  onParsingComplete(): void {
    // TODO: loader will emit the parsed resume from the backend here
    // this.router.navigate(['/validate']);
  }

  onBack(): void {
    if (this.uploadState() === 'parsing') {
      this.uploadState.set('selected');
      return;
    }
    this.router.navigate(['/']);
  }

  isParsing = computed(() => this.uploadState() === 'parsing');

  triggerFileInput(input: HTMLInputElement): void {
    input.click();
  }
}