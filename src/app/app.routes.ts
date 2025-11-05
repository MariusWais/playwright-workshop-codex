import { Routes } from '@angular/router';
import { PoliciesListComponent } from './policies/policies-list/policies-list.component';
import { PolicyFormComponent } from './policies/policy-form/policy-form.component';

export const routes: Routes = [
  { path: '', redirectTo: 'policies', pathMatch: 'full' },
  { path: 'policies', component: PoliciesListComponent },
  { path: 'policies/new', component: PolicyFormComponent },
  { path: 'policies/:id/edit', component: PolicyFormComponent },
];
