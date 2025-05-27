import { Routes } from '@angular/router';
import { WikiListComponent } from './components/wiki-list/wiki-list.component';
import { WikiSummaryComponent } from './components/wiki-summary/wiki-summary.component';

export const routes: Routes = [
  {
    path: '',
    component: WikiListComponent,
    title: 'Wikipedia Search'
  },
  {
    path: 'summary',
    component: WikiSummaryComponent,
    title: 'Article Summary'
  },
  {
    path: '**',
    redirectTo: ''
  }
];
