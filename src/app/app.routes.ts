import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/search',
    pathMatch: 'full'
  },
  {
    path: 'search',
    loadComponent: () => import('./pages/wikipedia-search/wikipedia-search.component').then(c => c.WikipediaSearchComponent)
  },
  {
    path: '**',
    redirectTo: '/search'
  }
];
