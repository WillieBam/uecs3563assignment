import { Routes } from '@angular/router';
import { DocumentDashboardComponent } from './components/document-dashboard/document-dashboard';
import { DocumentFormComponent } from './components/document-form/document-form';

export const routes: Routes = [
  // Angular Rule 11: Route registering and matching mapping to dashboard component
  { path: 'dashboard', component: DocumentDashboardComponent, children: [
      // Angular Rule 13: Nested / Child route configuration for previews
      { path: 'preview/:id', component: DocumentDashboardComponent }
  ]},
  { path: 'manage-form', component: DocumentFormComponent },
  // Angular Rule 11: Route redirect mapping for root pathing 
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  // Angular Rule 11: Wildcard route configuration capturing invalid URLs
  { path: '**', redirectTo: '/dashboard' }
];
