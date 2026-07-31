import { Routes } from '@angular/router';
import { DocumentDashboardComponent } from './components/document-dashboard/document-dashboard';
import { DocumentFormComponent } from './components/document-form/document-form';
import { DocumentViewComponent } from './components/document-view/document-view';
import { LoginComponent } from './components/login/login';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  // Angular Rule 11: Route registering and matching mapping to dashboard component protected by authGuard
  {
    path: 'dashboard',
    component: DocumentDashboardComponent,
    canActivate: [authGuard],
    children: [
      // Angular Rule 13: Nested / Child route configuration for previews
      { path: 'view/:id', component: DocumentViewComponent },
      { path: 'edit/:id', component: DocumentFormComponent }
    ]
  },
  { path: 'manage-form', component: DocumentFormComponent, canActivate: [authGuard] },
  // Angular Rule 11: Route redirect mapping for root pathing - redirect to /login by default
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  // Angular Rule 11: Wildcard route configuration capturing invalid URLs
  { path: '**', redirectTo: '/login' }
];
