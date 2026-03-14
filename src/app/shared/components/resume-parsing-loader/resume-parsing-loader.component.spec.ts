import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumeParsingLoaderComponent } from './resume-parsing-loader.component';

describe('ResumeParsingLoaderComponent', () => {
  let component: ResumeParsingLoaderComponent;
  let fixture: ComponentFixture<ResumeParsingLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResumeParsingLoaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResumeParsingLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
