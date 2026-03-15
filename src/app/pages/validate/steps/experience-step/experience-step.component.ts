import { Component, input, output, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ExperienceEntry } from '../../../../core/services/resume-session.service';

@Component({
  selector: 'app-experience-step',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './experience-step.component.html',
  styleUrls: ['./experience-step.component.css'],
})
export class ExperienceStepComponent implements OnInit {
  experience = input.required<ExperienceEntry[]>();
  experienceChanged = output<ExperienceEntry[]>();
  next = output<void>();
  back = output<void>();

  entries = signal<ExperienceEntry[]>([]);

  ngOnInit(): void {
    // Deep clone so edits don't mutate the parent signal
    this.entries.set(
      this.experience().map(e => ({
        ...e,
        bullets: [...e.bullets],
      }))
    );
  }

  // ── Entry level ───────────────────────────────────────────────
  updateField(index: number, field: keyof ExperienceEntry, value: string): void {
    this.entries.update(list => {
      const updated = [...list];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  }

  addEntry(): void {
    const newEntry: ExperienceEntry = {
      id: crypto.randomUUID(),
      company: '',
      title: '',
      startDate: '',
      endDate: '',
      bullets: [''],
    };
    this.entries.update(list => [newEntry, ...list]);
  }

  removeEntry(index: number): void {
    this.entries.update(list => list.filter((_, i) => i !== index));
  }

  // ── Bullet level ──────────────────────────────────────────────
  updateBullet(entryIndex: number, bulletIndex: number, value: string): void {
    this.entries.update(list => {
      const updated = list.map((e, i) => {
        if (i !== entryIndex) return e;
        const bullets = [...e.bullets];
        bullets[bulletIndex] = value;
        return { ...e, bullets };
      });
      return updated;
    });
  }

  addBullet(entryIndex: number): void {
    this.entries.update(list =>
      list.map((e, i) =>
        i === entryIndex ? { ...e, bullets: [...e.bullets, ''] } : e
      )
    );
  }

  removeBullet(entryIndex: number, bulletIndex: number): void {
    this.entries.update(list =>
      list.map((e, i) => {
        if (i !== entryIndex) return e;
        const bullets = e.bullets.filter((_, bi) => bi !== bulletIndex);
        return { ...e, bullets: bullets.length ? bullets : [''] };
      })
    );
  }

  // Handle Enter key in bullet textarea to add new bullet
  onBulletKeydown(event: KeyboardEvent, entryIndex: number, bulletIndex: number): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.addBullet(entryIndex);
      // Focus new bullet after render
      setTimeout(() => {
        const textareas = document.querySelectorAll<HTMLTextAreaElement>(
          `.entry-${entryIndex} .bullet__textarea`
        );
        textareas[bulletIndex + 1]?.focus();
      }, 50);
    }
  }

  onNext(): void {
    this.experienceChanged.emit(this.entries());
    this.next.emit();
  }

  onBack(): void {
    this.experienceChanged.emit(this.entries());
    this.back.emit();
  }
}