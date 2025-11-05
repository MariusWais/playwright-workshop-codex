import { Injectable, signal, computed, effect } from '@angular/core';
import { InsurancePolicy } from './insurance-policy.model';

@Injectable({ providedIn: 'root' })
export class PolicyService {
  private readonly STORAGE_KEY = 'insurance_policies';
  private readonly NEXT_ID_KEY = 'insurance_policies_next_id';

  private readonly policiesSignal = signal<InsurancePolicy[]>([]);
  private nextId = 1;

  // Public computed signal for read-only access
  policies = computed(() => this.policiesSignal());

  constructor() {
    // Load data from localStorage on initialization
    this.loadFromLocalStorage();

    // Automatically save to localStorage whenever policies change
    effect(() => {
      const policies = this.policiesSignal();
      this.saveToLocalStorage(policies);
    });
  }

  private loadFromLocalStorage(): void {
    try {
      const storedPolicies = localStorage.getItem(this.STORAGE_KEY);
      const storedNextId = localStorage.getItem(this.NEXT_ID_KEY);

      if (storedPolicies) {
        const policies: InsurancePolicy[] = JSON.parse(storedPolicies);
        this.policiesSignal.set(policies);
      }

      if (storedNextId) {
        this.nextId = Number.parseInt(storedNextId, 10);
      }
    } catch (error) {
      console.error('Error loading policies from localStorage:', error);
    }
  }

  private saveToLocalStorage(policies: InsurancePolicy[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(policies));
      localStorage.setItem(this.NEXT_ID_KEY, this.nextId.toString());
    } catch (error) {
      console.error('Error saving policies to localStorage:', error);
    }
  }

  getAll(): InsurancePolicy[] {
    return this.policiesSignal();
  }

  getById(id: number): InsurancePolicy | undefined {
    return this.policiesSignal().find(p => p.id === id);
  }

  add(policy: InsurancePolicy) {
    policy.id = this.nextId++;
    this.policiesSignal.update(policies => [...policies, {...policy}]);
  }

  update(policy: InsurancePolicy) {
    this.policiesSignal.update(policies =>
      policies.map(p => p.id === policy.id ? {...policy} : p)
    );
  }

  delete(id: number) {
    this.policiesSignal.update(policies => policies.filter(p => p.id !== id));
  }

  clear() {
    this.policiesSignal.set([]);
    this.nextId = 1;
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem(this.NEXT_ID_KEY);
  }
}
