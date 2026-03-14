import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/home/home.component').then((m) => m.HomeComponent),
        title: 'RoleFit – Match Your Resume to Any Role',
      },
      {
        path: 'upload-resume',
        loadComponent: () =>
          import('./pages/upload-resume/upload-resume.component').then(
            (m) => m.UploadResumeComponent
          ),
        title: 'RoleFit – Upload Resume',
      },
      {
        path: '**',
        redirectTo: '',
      },
    ],
  },
];
