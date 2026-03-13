import { Routes } from '@angular/router';

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
    loadComponent: () => import('./pages/register/register').then(m => m.Register)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then(m => m.Login)
  },
  {
    path: 'projects',
    loadComponent: () => import('./pages/projects/projects').then(m => m.Projects)
  },
  {
    path: 'students',
    loadComponent: () => import('./pages/students/students').then(m => m.Students)
  },
  {
    path: 'submit-project',
    loadComponent: () => import('./pages/submit-project/submit-project').then(m => m.SubmitProject)
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
    path: '**',
    redirectTo: 'home',
    pathMatch: 'full'
  }
];
