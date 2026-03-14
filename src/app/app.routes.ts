import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home').then(m => m.Home)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register').then(m => m.Register),
    canActivate: [authGuard],
    data: { mode: 'guest' }
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then(m => m.Login),
    canActivate: [authGuard],
    data: { mode: 'guest' }
  },
  {
    path: 'students',
    loadComponent: () => import('./pages/students/students').then(m => m.Students),
    canActivate: [authGuard],
    data: { mode: 'auth' }
  },
  {
    path: 'profile',
    loadComponent: () => import('./pages/profile/profile').then(m => m.Profile),
    canActivate: [authGuard],
    data: { mode: 'auth' }
  },
  {
    path: 'projects',
    loadComponent: () => import('./pages/projects/projects').then(m => m.Projects),
    canActivate: [authGuard],
    data: { mode: 'auth' }
  },
  {
    path: 'project/:id',
    loadComponent: () => import('./pages/submit-project/submit-project').then(m => m.SubmitProject),
    canActivate: [authGuard],
    data: { mode: 'auth' }
  },
  {
    path: 'competitions',
    loadComponent: () => import('./pages/competition/competitions').then(m => m.Competitions)
  },
  {
    path: 'submit-competition/:id',
    loadComponent: () => import('./pages/submit-competition/submit-competition').then(m => m.SubmitCompetition)
  },
  {
    path: 'winners',
    loadComponent: () => import('./pages/winners/winners').then(m => m.Winners)
  },
  {
    path: 'about',
    loadComponent: () => import('./pages/about/about').then(m => m.About)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard').then(m => m.Dashboard),
    canActivate: [authGuard],
    data: { mode: 'auth' }
  },
  {
    path: '**',
    redirectTo: 'home',
    pathMatch: 'full'
  }
];
