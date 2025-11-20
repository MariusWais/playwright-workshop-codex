# Insurance Policy App - Complete Flow Test Plan

## Application Overview

The Insurance Policy Management application is an Angular 20-based CRUD system with localStorage persistence. This test plan maps the complete user journey from policy creation through editing, deletion, and data persistence verification.

**Key Technical Details:**
- **Routes:** `/policies` (list), `/policies/new` (create), `/policies/:id/edit` (edit)
- **Storage:** localStorage with keys `insurance_policies` and `insurance_policies_next_id`
- **IDs:** Auto-incrementing starting from 1, persisted across sessions
- **Selectors:** All interactive elements have `data-testid` attributes for stable testing

---

## Complete Flow Scenarios

### Scenario 1: End-to-End Happy Path Flow

**Objective:** Verify the complete lifecycle of a policy from creation through editing, persistence, and deletion.

**Preconditions:**
- Application running at `http://localhost:4222`
- localStorage cleared (fresh start)
- Browser at `/policies`

**Test Data:**
- **Initial Policy:**
  - Policy Number: POL-E2E-001
  - Customer Name: Sarah Johnson
  - Start Date: 2025-01-01
  - End Date: 2025-12-31
  - Premium: 1500.00

- **Updated Policy:**
  - Policy Number: POL-E2E-001 (unchanged)
  - Customer Name: Sarah Johnson-Smith (name change)
  - Start Date: 2025-01-01 (unchanged)
  - End Date: 2025-12-31 (unchanged)
  - Premium: 1750.50 (premium increase)

**Steps:**

#### Part 1: CREATE
1. Navigate to `/policies`
2. Verify empty state displays:
   - Empty icon (📋)
   - "No policies yet" heading
   - "Add Your First Policy" button visible
3. Click `data-testid="add-policy"` button
4. Verify navigation to `/policies/new`
5. Verify form heading shows "Add New Policy"
6. Verify breadcrumb shows "Policies / New"
7. Fill `data-testid="policyNumber"` with "POL-E2E-001"
8. Fill `data-testid="customerName"` with "Sarah Johnson"
9. Fill `data-testid="startDate"` with "2025-01-01"
10. Fill `data-testid="endDate"` with "2025-12-31"
11. Fill `data-testid="premiumAmount"` with "1500.00"
12. Verify `data-testid="save"` button is enabled
13. Click `data-testid="save"` button
14. Verify navigation to `/policies`
15. Verify table is displayed (not empty state)
16. Verify row `data-testid="policy-row-1"` exists
17. Verify `data-testid="policy-number-1"` displays "POL-E2E-001"
18. Verify `data-testid="customer-name-1"` displays "Sarah Johnson"
19. Verify `data-testid="premium-1"` displays "$1500.00" (formatted with 2 decimals)
20. Verify `data-testid="edit-1"` button exists
21. Verify `data-testid="delete-1"` button exists

#### Part 2: PERSISTENCE CHECK (After Create)
22. Open browser DevTools → Application → Local Storage
23. Verify key `insurance_policies` exists
24. Verify value contains policy with id=1, policyNumber="POL-E2E-001"
25. Verify key `insurance_policies_next_id` equals "2"
26. Reload page (F5 or Cmd+R)
27. Verify URL remains `/policies`
28. Verify policy row still visible with correct data
29. Verify `data-testid="policy-number-1"` still shows "POL-E2E-001"

#### Part 3: EDIT
30. Click `data-testid="edit-1"` button
31. Verify navigation to `/policies/1/edit`
32. Verify form heading shows "Edit Policy"
33. Verify breadcrumb shows "Policies / Edit"
34. Verify `data-testid="policyNumber"` is pre-filled with "POL-E2E-001"
35. Verify `data-testid="customerName"` is pre-filled with "Sarah Johnson"
36. Verify `data-testid="startDate"` is pre-filled with "2025-01-01"
37. Verify `data-testid="endDate"` is pre-filled with "2025-12-31"
38. Verify `data-testid="premiumAmount"` is pre-filled with "1500"
39. Verify `data-testid="save"` button is enabled (form valid with existing data)
40. Clear `data-testid="customerName"`
41. Fill `data-testid="customerName"` with "Sarah Johnson-Smith"
42. Clear `data-testid="premiumAmount"`
43. Fill `data-testid="premiumAmount"` with "1750.50"
44. Click `data-testid="save"` button (now shows "Update Policy")
45. Verify navigation to `/policies`
46. Verify `data-testid="policy-number-1"` still shows "POL-E2E-001" (unchanged)
47. Verify `data-testid="customer-name-1"` now shows "Sarah Johnson-Smith" (updated)
48. Verify `data-testid="premium-1"` now shows "$1750.50" (updated)

#### Part 4: PERSISTENCE CHECK (After Edit)
49. Verify localStorage `insurance_policies` updated with new customer name and premium
50. Verify `insurance_policies_next_id` still equals "2" (no new policy added)
51. Reload page
52. Verify updated data persists:
    - Customer name: "Sarah Johnson-Smith"
    - Premium: "$1750.50"

#### Part 5: DELETE
53. Click `data-testid="delete-1"` button
54. Verify browser confirm dialog appears with text: "Are you sure you want to delete this policy?"
55. Click "Cancel" on confirm dialog
56. Verify policy row still exists (not deleted)
57. Verify `data-testid="policy-row-1"` still visible
58. Click `data-testid="delete-1"` button again
59. Verify confirm dialog appears again
60. Click "OK" or confirm deletion
61. Verify table disappears
62. Verify empty state is displayed again:
    - Empty icon (📋)
    - "No policies yet" heading
    - "Add Your First Policy" button

#### Part 6: PERSISTENCE CHECK (After Delete)
63. Verify localStorage `insurance_policies` is empty array `[]`
64. Verify `insurance_policies_next_id` equals "2" (ID counter not reset by delete)
65. Reload page
66. Verify empty state persists (no policies visible)

**Expected Results:**
- Policy successfully created with ID=1
- Data persists after page reload (create)
- Edit form pre-populates with existing data
- Updates reflect in list view
- Updates persist after page reload (edit)
- Delete requires confirmation
- Canceling delete preserves policy
- Confirming delete removes policy and shows empty state
- Deletion persists after page reload
- ID counter increments but doesn't reset on delete

**Pass Criteria:**
All 66 steps complete successfully without errors.

**Failure Modes:**
- Data lost after reload (persistence failure)
- Edit form doesn't pre-populate (data retrieval issue)
- Updates don't reflect in list (state update failure)
- Delete bypasses confirmation (security issue)
- Empty state not shown after deleting last policy (UI logic error)

---

### Scenario 2: Multi-Policy Flow with Selective Edit and Delete

**Objective:** Verify CRUD operations work correctly with multiple policies and that operations target the correct policy.

**Preconditions:**
- Application running
- localStorage cleared
- Browser at `/policies`

**Test Data:**
| Policy # | Customer | Start Date | End Date | Premium |
|----------|----------|------------|----------|---------|
| POL-MULTI-001 | Alice Chen | 2025-01-15 | 2025-12-31 | 2000.00 |
| POL-MULTI-002 | Bob Martinez | 2025-02-01 | 2026-01-31 | 2500.00 |
| POL-MULTI-003 | Carol White | 2025-03-10 | 2025-09-30 | 1200.00 |

**Steps:**

#### Part 1: CREATE MULTIPLE
1. Navigate to `/policies`
2. Create Policy #1 (Alice Chen) following create flow
3. Verify policy with ID=1 appears in list
4. Create Policy #2 (Bob Martinez)
5. Verify two rows visible: `policy-row-1` and `policy-row-2`
6. Create Policy #3 (Carol White)
7. Verify three rows visible
8. Verify correct data in each row:
   - Row 1: POL-MULTI-001, Alice Chen, $2000.00
   - Row 2: POL-MULTI-002, Bob Martinez, $2500.00
   - Row 3: POL-MULTI-003, Carol White, $1200.00

#### Part 2: EDIT MIDDLE POLICY (ID=2)
9. Click `data-testid="edit-2"` (Bob's policy)
10. Verify navigation to `/policies/2/edit`
11. Verify form shows Bob's data
12. Change premium to 2750.00
13. Save and return to list
14. Verify only Bob's premium updated:
    - Row 1: still $2000.00
    - Row 2: now $2750.00 (updated)
    - Row 3: still $1200.00

#### Part 3: DELETE FIRST POLICY (ID=1)
15. Click `data-testid="delete-1"` (Alice's policy)
16. Confirm deletion
17. Verify two rows remain: IDs 2 and 3
18. Verify Alice's policy (ID=1) is gone
19. Verify Bob (ID=2) and Carol (ID=3) still present

#### Part 4: PERSISTENCE CHECK
20. Reload page
21. Verify two policies still visible (Bob and Carol)
22. Verify localStorage contains only IDs 2 and 3
23. Verify `insurance_policies_next_id` equals "4" (ready for next create)

#### Part 5: CREATE NEW POLICY (After Delete)
24. Create new policy:
    - Policy #: POL-MULTI-004
    - Customer: David Lee
    - Premium: 3000.00
25. Verify new policy gets ID=4 (not reusing ID=1)
26. Verify three rows now visible: IDs 2, 3, 4
27. Verify localStorage contains three policies
28. Verify `insurance_policies_next_id` equals "5"

**Expected Results:**
- Multiple policies can coexist
- Edit targets correct policy by ID
- Other policies unaffected by edit
- Delete removes only targeted policy
- IDs don't get reused after delete
- ID counter continues incrementing

---

### Scenario 3: Persistence Across Browser Sessions

**Objective:** Verify data persists not just across page reloads but also after closing and reopening the browser.

**Preconditions:**
- Application running
- localStorage cleared

**Steps:**
1. Create a policy with test data
2. Verify policy visible in list
3. Note the policy ID and data
4. Close browser completely (not just tab)
5. Reopen browser
6. Navigate to `http://localhost:4222/policies`
7. Verify policy still visible with correct data
8. Verify policy ID unchanged
9. Verify localStorage still contains policy data
10. Edit the policy and save
11. Close browser again
12. Reopen and navigate to app
13. Verify edit persisted
14. Delete policy
15. Close browser
16. Reopen and navigate to app
17. Verify empty state shown (policy stayed deleted)

**Expected Results:**
- Policy data survives browser close/reopen
- Edits persist across sessions
- Deletions persist across sessions
- ID counter persists (new policies after reopen get sequential IDs)

---

### Scenario 4: Cancel Operations (No Persistence)

**Objective:** Verify that canceling create/edit operations does NOT persist any changes to localStorage.

**Preconditions:**
- Application running
- At least one existing policy (ID=1)

**Steps:**

#### Part 1: CANCEL CREATE
1. Navigate to `/policies/new`
2. Fill form with test data (POL-CANCEL-001, John Doe, etc.)
3. Click Cancel button
4. Verify navigation to `/policies`
5. Verify POL-CANCEL-001 does NOT appear in list
6. Verify localStorage unchanged (no new policy added)
7. Verify `insurance_policies_next_id` unchanged

#### Part 2: CANCEL EDIT
8. Click edit on existing policy (ID=1)
9. Change customer name to "Modified Name"
10. Change premium to 9999.99
11. Click Cancel button
12. Verify navigation to `/policies`
13. Verify policy data unchanged (original name and premium)
14. Verify localStorage unchanged
15. Reload page to confirm no changes persisted

**Expected Results:**
- Cancel button aborts operation
- No data written to localStorage
- Existing data remains unchanged
- ID counter doesn't increment on canceled creates

---

### Scenario 5: Edit → Reload → Verify Pre-fill Persistence

**Objective:** Verify that navigating directly to an edit URL after a reload correctly loads and displays policy data.

**Preconditions:**
- Application running
- Existing policy with ID=5 and known data

**Steps:**
1. Navigate directly to URL: `/policies/5/edit` (bookmark or manual URL entry)
2. Wait for page load
3. Verify form heading shows "Edit Policy"
4. Verify all fields pre-filled with correct data from policy ID=5
5. Verify `data-testid="save"` button enabled
6. Make a small change (e.g., increment premium by $10)
7. Save
8. Reload the edit page: `/policies/5/edit`
9. Verify updated premium is now in the form

**Expected Results:**
- Direct navigation to edit URL works
- Form correctly loads policy by ID from localStorage
- Changes persist and reload correctly

---

### Scenario 6: Delete Last Policy → Re-create → Verify ID Increment

**Objective:** Verify that IDs continue incrementing even after all policies are deleted.

**Preconditions:**
- Application running
- Single policy exists with ID=10

**Steps:**
1. Note current policy ID (10)
2. Note `insurance_policies_next_id` in localStorage (should be 11)
3. Delete the policy (ID=10)
4. Verify empty state shown
5. Verify localStorage `insurance_policies` is `[]`
6. Verify `insurance_policies_next_id` still equals "11" (not reset)
7. Create new policy
8. Verify new policy gets ID=11 (not restarting at 1)
9. Verify `insurance_policies_next_id` now equals "12"

**Expected Results:**
- ID counter never resets
- New policies always get sequential IDs even after deleting all
- Empty localStorage array doesn't reset ID counter

---

## Data-Testid Selector Reference

### List Page (`/policies`)
- `add-policy` — "Add Policy" button in header
- `policy-row-{id}` — Table row for policy with given ID
- `policy-number-{id}` — Policy number cell
- `customer-name-{id}` — Customer name cell
- `premium-{id}` — Premium amount cell (formatted as $X.XX)
- `edit-{id}` — Edit button for policy
- `delete-{id}` — Delete button for policy

### Form Page (`/policies/new` or `/policies/:id/edit`)
- `policyNumber` — Policy number input field
- `customerName` — Customer name input field
- `startDate` — Start date input (type="date")
- `endDate` — End date input (type="date")
- `premiumAmount` — Premium amount input (type="number")
- `save` — Submit button (text changes: "Create Policy" vs "Update Policy")

### LocalStorage Keys
- `insurance_policies` — Array of policy objects
- `insurance_policies_next_id` — Next available ID (string representation of number)

---

## Testing Strategy Notes

### Execution Order
These scenarios are designed to be **independent** and can run in any order. Each scenario should:
1. Start with a clean localStorage state (use `beforeEach` to clear)
2. Create its own test data
3. Clean up after itself (optional, if suite shares state)

### ID Assumptions
Tests assume:
- First policy created gets ID=1
- IDs increment sequentially
- IDs are never reused

For stable tests, either:
- Clear localStorage before each test, OR
- Query the actual ID dynamically after creation (don't hardcode ID expectations)

### Timing Considerations
- All operations are synchronous (localStorage writes are instant)
- No network delays (no API calls)
- Page navigations are near-instant (Angular routing)
- Auto-wait for elements is sufficient (no explicit waits needed)

### Browser Confirm Dialog
Delete operations trigger `window.confirm()`. In Playwright:
```typescript
page.on('dialog', dialog => dialog.accept()); // Auto-confirm
// OR
page.on('dialog', dialog => dialog.dismiss()); // Auto-cancel
```

### Recommended Test Structure
```typescript
test.describe('Complete Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage
    await page.goto('http://localhost:4222/policies');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('Scenario 1: End-to-End Happy Path', async ({ page }) => {
    // CREATE phase
    // PERSIST check
    // EDIT phase
    // PERSIST check
    // DELETE phase
    // PERSIST check
  });
});
```

---

## Coverage Summary

This test plan covers:
- ✅ CREATE operation (form fill, validation, submission, redirect)
- ✅ READ operation (list display, data retrieval)
- ✅ UPDATE operation (edit form pre-fill, modification, save)
- ✅ DELETE operation (confirmation dialog, removal, empty state)
- ✅ localStorage persistence (create, edit, delete, reload)
- ✅ ID auto-increment behavior
- ✅ Cancel operations (no persistence)
- ✅ Multiple policy management
- ✅ Direct navigation to edit URL
- ✅ Browser session persistence

**Not Covered** (consider for future test expansion):
- Form validation errors (empty fields, invalid formats)
- Network failure scenarios (N/A for localStorage)
- Concurrent user scenarios (N/A for localStorage)
- Large dataset performance (100+ policies)
- Accessibility testing (keyboard nav, screen readers)
- Visual regression (layout, styling)
