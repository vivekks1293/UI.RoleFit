import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillsEducationStepComponent } from './skills-education-step.component';

describe('SkillsEducationStepComponent', () => {
  let component: SkillsEducationStepComponent;
  let fixture: ComponentFixture<SkillsEducationStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkillsEducationStepComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SkillsEducationStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
