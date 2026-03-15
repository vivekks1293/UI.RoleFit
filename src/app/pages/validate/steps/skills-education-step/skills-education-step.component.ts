import { Component, input, output, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EducationEntry } from '../../../../core/services/resume-session.service';

@Component({
  selector: 'app-skills-education-step',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './skills-education-step.component.html',
  styleUrls: ['./skills-education-step.component.css'],
})
export class SkillsEducationStepComponent implements OnInit {
  skills    = input.required<string[]>();
  education = input.required<EducationEntry[]>();

  skillsChanged    = output<string[]>();
  educationChanged = output<EducationEntry[]>();
  next = output<void>();
  back = output<void>();

  skillList  = signal<string[]>([]);
  newSkill   = signal('');
  eduList    = signal<EducationEntry[]>([]);

  ngOnInit(): void {
    this.skillList.set([...this.skills()]);
    this.eduList.set(this.education().map(e => ({ ...e })));
  }

  // ── Skills ────────────────────────────────────────────────────
  addSkill(): void {
    const trimmed = this.newSkill().trim();
    if (!trimmed || this.skillList().includes(trimmed)) return;
    this.skillList.update(list => [...list, trimmed]);
    this.newSkill.set('');
  }

  removeSkill(skill: string): void {
    this.skillList.update(list => list.filter(s => s !== skill));
  }

  onSkillKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.addSkill();
    }
  }

  // ── Education ─────────────────────────────────────────────────
  updateEdu(index: number, field: keyof EducationEntry, value: string): void {
    this.eduList.update(list => {
      const updated = [...list];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  }

  addEdu(): void {
    this.eduList.update(list => [
      ...list,
      {
        id: crypto.randomUUID(),
        institution: '',
        degree: '',
        field: '',
        graduationYear: '',
      },
    ]);
  }

  removeEdu(index: number): void {
    this.eduList.update(list => list.filter((_, i) => i !== index));
  }

  onNext(): void {
    this.skillsChanged.emit(this.skillList());
    this.educationChanged.emit(this.eduList());
    this.next.emit();
  }

  onBack(): void {
    this.skillsChanged.emit(this.skillList());
    this.educationChanged.emit(this.eduList());
    this.back.emit();
  }
}