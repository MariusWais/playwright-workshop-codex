# Insurance Policy Management App - Test Plan

## Overview
This test plan covers the end-to-end testing of the Insurance Policy Management application built with Angular 20. The app provides CRUD (Create, Read, Update, Delete) operations for insurance policies with client-side localStorage persistence.

## Application Under Test
- **URL**: http://localhost:4222
- **Routes**:
  - `/policies` - List view (default)
  - `/policies/new` - Create new policy
  - `/policies/:id/edit` - Edit existing policy

## Test Scenarios

---

### 1. Empty State Display

**Objective**: Verify the application displays an appropriate empty state when no policies exist.

**Preconditions**: 
- Clear all existing policies from localStorage

**Steps**:
1. Navigate to the policies list page
2. Verify the empty state is displayed with:
   - Empty state icon (📋)
   - "No policies yet" heading
   - "Get started by adding your first insurance policy" message
   - "Add Your First Policy" button

**Expected Results**:
- Empty state UI is displayed correctly
- No table is shown
- "Add Policy" button is visible in the header

---

### 2. Create New Policy - Happy Path

**Objective**: Verify a user can successfully create a new insurance policy with valid data.

**Preconditions**: 
- Application is running
- Navigate to policies list page

**Steps**:
1. Click the "+ Add Policy" button
2. Verify navigation to `/policies/new`
3. Verify form displays with heading "Add New Policy"
4. Fill in the policy number field: "POL-2024-001"
5. Fill in the customer name field: "John Smith"
6. Fill in the start date field: "2024-01-01"
7. Fill in the end date field: "2024-12-31"
8. Fill in the premium amount field: "1250.50"
9. Click the "Create Policy" button
10. Verify navigation back to `/policies`
11. Verify the new policy appears in the table with:
    - Policy Number: POL-2024-001
    - Customer Name: John Smith
    - Premium Amount: $1250.50

**Expected Results**:
- Form submission is successful
- User is redirected to the policies list
- New policy is visible in the table
- Data persists in localStorage

---

### 3. Create Policy - Form Validation

**Objective**: Verify form validation works correctly and prevents submission with invalid data.

**Preconditions**: 
- Navigate to add new policy form

**Steps**:
1. Verify the "Create Policy" button is disabled initially
2. Click in the "Policy Number" field
3. Click in the "Customer Name" field (without entering data)
4. Verify error message appears: "Policy number is required"
5. Click in the "Start Date" field
6. Verify error message appears: "Customer name is required"
7. Continue clicking through all required fields without entering data
8. Verify appropriate error messages appear for each field
9. Verify the "Create Policy" button remains disabled

**Expected Results**:
- All fields show validation errors when touched but empty
- Submit button remains disabled until all required fields are valid
- Error messages are clear and specific to each field

---

### 4. Create Policy - Cancel Operation

**Objective**: Verify that canceling the create operation does not save any data.

**Preconditions**: 
- Navigate to add new policy form

**Steps**:
1. Fill in the policy number: "POL-2024-999"
2. Fill in the customer name: "Test User"
3. Leave other fields empty
4. Click the "Cancel" button
5. Verify navigation back to `/policies`
6. Verify no new policy with "POL-2024-999" appears in the list

**Expected Results**:
- User is returned to the policies list
- No data is saved
- Policy list remains unchanged

---

### 5. Edit Existing Policy

**Objective**: Verify a user can successfully edit an existing policy.

**Preconditions**: 
- At least one policy exists in the system
- Policy details: POL-2024-001, John Smith, $1250.50

**Steps**:
1. Navigate to the policies list page
2. Click the "Edit" button for the policy "POL-2024-001"
3. Verify navigation to `/policies/1/edit`
4. Verify form displays with heading "Edit Policy"
5. Verify all fields are pre-populated with existing data:
   - Policy Number: POL-2024-001
   - Customer Name: John Smith
   - Premium Amount: 1250.5
6. Change the premium amount to "1500.00"
7. Click the "Update Policy" button
8. Verify navigation back to `/policies`
9. Verify the updated policy appears with premium: $1500.00

**Expected Results**:
- Form is pre-populated with existing data
- Changes are saved successfully
- Updated data is reflected in the list view
- Changes persist in localStorage

---

### 6. Edit Policy - Cancel Operation

**Objective**: Verify that canceling an edit operation does not save changes.

**Preconditions**: 
- At least one policy exists
- Navigate to edit form for that policy

**Steps**:
1. Change the premium amount to a different value
2. Change the customer name
3. Click the "Cancel" button
4. Verify navigation back to `/policies`
5. Verify the policy data remains unchanged (original values displayed)

**Expected Results**:
- User is returned to the policies list
- No changes are saved
- Original data is preserved

---

### 7. Delete Policy - Confirm Deletion

**Objective**: Verify a user can delete a policy with confirmation.

**Preconditions**: 
- Multiple policies exist in the system

**Steps**:
1. Navigate to the policies list page
2. Note the current number of policies
3. Click the "Delete" button for a specific policy
4. Verify a confirmation dialog appears with message: "Are you sure you want to delete this policy?"
5. Click "OK" or confirm the deletion
6. Verify the policy is removed from the list
7. Verify the policy count decreases by one

**Expected Results**:
- Confirmation dialog appears before deletion
- Policy is successfully removed after confirmation
- Policy list updates immediately
- Deletion persists in localStorage

---

### 8. Delete Policy - Cancel Deletion

**Objective**: Verify that canceling a delete operation preserves the policy.

**Preconditions**: 
- At least one policy exists

**Steps**:
1. Navigate to the policies list page
2. Click the "Delete" button for a specific policy
3. Verify a confirmation dialog appears
4. Click "Cancel" to dismiss the dialog
5. Verify the policy remains in the list
6. Verify all policy data is intact

**Expected Results**:
- Confirmation dialog appears
- Policy is NOT deleted when user cancels
- Policy list remains unchanged

---

### 9. Delete Last Policy - Return to Empty State

**Objective**: Verify that deleting the last policy returns the user to the empty state.

**Preconditions**: 
- Exactly one policy exists in the system

**Steps**:
1. Navigate to the policies list page
2. Click the "Delete" button for the only policy
3. Confirm the deletion
4. Verify the table disappears
5. Verify the empty state is displayed with:
   - Empty state icon
   - "No policies yet" heading
   - "Add Your First Policy" button

**Expected Results**:
- Policy is deleted successfully
- Empty state UI is displayed
- No errors occur

---

### 10. Create Multiple Policies

**Objective**: Verify the application can handle multiple policies correctly.

**Preconditions**: 
- Application is running with no existing policies

**Steps**:
1. Create first policy:
   - Policy Number: POL-2024-001
   - Customer Name: John Smith
   - Start Date: 2024-01-01
   - End Date: 2024-12-31
   - Premium: 1500.00
2. Create second policy:
   - Policy Number: POL-2024-002
   - Customer Name: Jane Doe
   - Start Date: 2024-03-15
   - End Date: 2025-03-14
   - Premium: 2500.00
3. Create third policy:
   - Policy Number: POL-2024-003
   - Customer Name: Bob Johnson
   - Start Date: 2024-06-01
   - End Date: 2025-05-31
   - Premium: 3000.00
4. Verify all three policies appear in the table
5. Verify each policy displays correct data
6. Verify each policy has Edit and Delete buttons

**Expected Results**:
- All three policies are created successfully
- All policies are visible in the table
- Data is accurate for each policy
- Table formatting is correct with multiple rows

---

### 11. Breadcrumb Navigation

**Objective**: Verify breadcrumb navigation works correctly.

**Preconditions**: 
- Navigate to the add/edit policy form

**Steps**:
1. Click "+ Add Policy" button to navigate to `/policies/new`
2. Verify breadcrumb shows "Policies / New"
3. Click "Policies" link in the breadcrumb
4. Verify navigation back to `/policies`
5. Click "Edit" on a policy
6. Verify breadcrumb shows "Policies / Edit"
7. Click "Policies" link in the breadcrumb
8. Verify navigation back to `/policies`

**Expected Results**:
- Breadcrumb displays correct context
- Breadcrumb links are clickable and functional
- Navigation works as expected

---

### 12. Data Persistence

**Objective**: Verify that policy data persists across browser sessions.

**Preconditions**: 
- Create one or more policies

**Steps**:
1. Create a new policy with test data
2. Note the policy details
3. Refresh the browser page
4. Verify the policy still appears in the list with correct data
5. Close the browser
6. Reopen the browser and navigate to the app
7. Verify the policy data is still present

**Expected Results**:
- Policy data persists after page refresh
- Policy data persists after closing and reopening the browser
- Data is retrieved correctly from localStorage

---

### 13. Form Field Types and Constraints

**Objective**: Verify all form fields have correct input types and constraints.

**Preconditions**: 
- Navigate to add new policy form

**Steps**:
1. Verify "Policy Number" is a text input
2. Verify "Customer Name" is a text input
3. Verify "Start Date" is a date picker input
4. Verify "End Date" is a date picker input
5. Verify "Premium Amount" is a number input
6. Verify "Premium Amount" has:
   - Placeholder showing "0.00"
   - Step attribute of "0.01"
   - Min attribute of "0"
7. Verify all fields are marked as required (asterisk)
8. Verify hint text displays: "Enter the premium amount in USD"

**Expected Results**:
- All fields have appropriate input types
- Number field has correct constraints
- All required fields are marked
- Helper text is displayed

---

### 14. Premium Amount Formatting

**Objective**: Verify premium amounts are displayed with correct currency formatting.

**Preconditions**: 
- Create policies with various premium amounts

**Steps**:
1. Create policy with premium: 1250.5
2. Verify it displays as: $1250.50
3. Create policy with premium: 999
4. Verify it displays as: $999.00
5. Create policy with premium: 10000.99
6. Verify it displays as: $10000.99

**Expected Results**:
- Premium amounts always show 2 decimal places
- Dollar sign ($) is prefixed
- Formatting is consistent across all policies

---

### 15. Button States

**Objective**: Verify button states change appropriately based on form validity.

**Preconditions**: 
- Navigate to add new policy form

**Steps**:
1. Verify "Create Policy" button is disabled initially
2. Fill only the policy number field
3. Verify button remains disabled
4. Fill all required fields with valid data
5. Verify "Create Policy" button becomes enabled
6. Clear one required field
7. Verify button becomes disabled again
8. Navigate to edit form
9. Verify "Update Policy" button is enabled (form is valid with existing data)

**Expected Results**:
- Submit button is disabled when form is invalid
- Submit button is enabled when form is valid
- Button state updates reactively as form changes

---

## Test Data

### Valid Test Data
- **Policy Number**: POL-2024-001, POL-2024-002, POL-2024-003
- **Customer Names**: John Smith, Jane Doe, Bob Johnson
- **Start Dates**: 2024-01-01, 2024-03-15, 2024-06-01
- **End Dates**: 2024-12-31, 2025-03-14, 2025-05-31
- **Premium Amounts**: 1250.50, 1500.00, 2500.00, 3000.00

### Edge Cases to Consider
- Empty strings
- Very long customer names (100+ characters)
- Very large premium amounts (999999.99)
- Very small premium amounts (0.01)
- Past dates for start/end dates
- End date before start date

## Testing Tools
- **Framework**: Playwright
- **Fixtures**: Custom fixtures in `e2e/fixtures.ts`
- **Test Location**: `e2e/tests-examples/`
- **Selectors**: `data-testid` attributes for form inputs, role-based selectors where appropriate

## Notes
- The app uses localStorage for persistence, so tests should clear storage before running
- Delete operations trigger browser confirm dialogs that need to be handled
- Form validation is reactive and prevents submission when invalid
- All CRUD operations update the UI synchronously
- Date inputs should use format: YYYY-MM-DD
