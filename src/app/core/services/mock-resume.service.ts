import { Injectable } from '@angular/core';
import { BaseResume } from './resume-session.service';

/**
 * MockResumeService
 * Returns a hardcoded resume so the validate page works before
 * the Python parser is wired up. Delete this once the real
 * ResumeParserService is connected.
 */
@Injectable({ providedIn: 'root' })
export class MockResumeService {
  getMockResume(): BaseResume {
    return {
      name: 'Alex Johnson',
      contact: {
        email: 'alex.johnson@email.com',
        phone: '+1 (555) 234-5678',
        linkedin: 'linkedin.com/in/alexjohnson',
        location: 'San Francisco, CA',
      },
      summary:
        'Full-stack engineer with 6 years of experience building scalable web applications. Passionate about clean architecture, developer tooling, and shipping products that users love.',
      skills: [
        'TypeScript', 'Angular', 'React', 'Node.js',
        'Python', 'FastAPI', 'PostgreSQL', 'Docker',
        'AWS', 'CI/CD', 'REST APIs', 'GraphQL',
      ],
      experience: [
        {
          id: 'exp-1',
          company: 'Acme Corp',
          title: 'Senior Frontend Engineer',
          startDate: 'Jan 2022',
          endDate: null,
          bullets: [
            'Led migration of legacy AngularJS app to Angular 17, reducing bundle size by 42%.',
            'Built a real-time collaboration feature used by 50,000+ daily active users.',
            'Mentored 3 junior engineers through weekly code reviews and pair programming sessions.',
          ],
        },
        {
          id: 'exp-2',
          company: 'Startup XYZ',
          title: 'Full Stack Developer',
          startDate: 'Mar 2019',
          endDate: 'Dec 2021',
          bullets: [
            'Designed and implemented REST APIs in Node.js serving 2M+ requests per day.',
            'Reduced page load time by 60% through lazy loading and image optimisation.',
            'Owned end-to-end delivery of the billing module, integrating Stripe payments.',
          ],
        },
        {
          id: 'exp-3',
          company: 'Freelance',
          title: 'Web Developer',
          startDate: 'Jun 2018',
          endDate: 'Feb 2019',
          bullets: [
            'Built 8 client websites using React and Next.js.',
            'Delivered projects on time and within budget for all clients.',
          ],
        },
      ],
      education: [
        {
          id: 'edu-1',
          institution: 'University of California, Berkeley',
          degree: 'B.S.',
          field: 'Computer Science',
          graduationYear: '2018',
        },
      ],
      parseConfidence: 1,
      sourceFile: null,
    };
  }
}