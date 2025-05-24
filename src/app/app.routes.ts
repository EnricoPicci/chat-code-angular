import { Routes } from '@angular/router';

import { HomePage } from './pages/home/home.page';
/** Application routes */
export const routes: Routes = [
  { path: '', component: HomePage },
  { path: '**', redirectTo: '' }
];
