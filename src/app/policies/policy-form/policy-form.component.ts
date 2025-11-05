import { Component, inject, signal } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PolicyService } from '../policy.service';
import { InsurancePolicy } from '../insurance-policy.model';

@Component({
  selector: 'app-policy-form',
  templateUrl: './policy-form.component.html',
  styleUrl: './policy-form.component.scss',
  standalone: true,
  imports: [ReactiveFormsModule]
})
export class PolicyFormComponent {
  private readonly ps = inject(PolicyService);
  protected readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected isEdit = signal(false);

  form = new FormGroup({
    id: new FormControl(1),
    policyNumber: new FormControl('', Validators.required),
    customerName: new FormControl('', Validators.required),
    startDate: new FormControl('', Validators.required),
    endDate: new FormControl('', Validators.required),
    premiumAmount: new FormControl(0, Validators.required),
  });

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const p = this.ps.getById(Number(id));
      if (p) {
        this.form.patchValue(p);
        this.isEdit.set(true);
      }
    }
  }

  save() {
    if (this.form.invalid) return;
    const policy: InsurancePolicy = this.form.value as InsurancePolicy;
    if (this.isEdit()) {
      this.ps.update(policy);
    } else {
      this.ps.add(policy);
    }
    void this.router.navigate(['/policies']);
  }
}
