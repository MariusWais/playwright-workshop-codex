import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { PolicyService } from '../policy.service';

@Component({
  selector: 'app-policies-list',
  templateUrl: './policies-list.component.html',
  styleUrl: './policies-list.component.scss',
  standalone: true,
  imports: []
})
export class PoliciesListComponent {
  private readonly ps = inject(PolicyService);
  protected readonly router = inject(Router);

  protected policies = this.ps.policies;

  delete(id?: number) {
    if (!id) return;
    if (confirm('Are you sure you want to delete this policy?')) {
      this.ps.delete(id);
    }
  }
}
