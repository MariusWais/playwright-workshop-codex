// Centralized data-testid selectors for better maintainability
export const SELECTORS = {
  // Navigation & Actions
  ADD_POLICY_BUTTON: 'add-policy',
  SAVE_BUTTON: 'save',
  
  // Form Fields
  POLICY_NUMBER: 'policyNumber',
  CUSTOMER_NAME: 'customerName',
  START_DATE: 'startDate',
  END_DATE: 'endDate',
  PREMIUM_AMOUNT: 'premiumAmount',
  
  // List Actions
  editButton: (id: number) => `edit-${id}`,
  deleteButton: (id: number) => `delete-${id}`,
} as const;
