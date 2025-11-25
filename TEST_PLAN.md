# Insurance Policy Management Application - Comprehensive Test Plan

## Application Overview

The Insurance Policy Management Application is an Angular-based web application that provides comprehensive CRUD (Create, Read, Update, Delete) functionality for managing insurance policies. The application features:

- **Policy Creation**: Add new insurance policies with policy number, customer name, date range, and premium amount
- **Policy List View**: Display all policies in a tabular format with key information
- **Policy Editing**: Modify existing policy details
- **Policy Deletion**: Remove policies with confirmation dialog
- **Form Validation**: Required field validation with real-time feedback
- **Data Persistence**: Local storage-based persistence for maintaining data between sessions
- **Responsive Navigation**: Breadcrumb navigation and clear routing between views
- **Empty State**: User-friendly guidance when no policies exist

**Key Technical Details:**
- Date fields require YYYY-MM-DD format (HTML5 date input)
- Premium amounts displayed with USD currency formatting ($X,XXX.XX)
- All fields are required (policy number, customer name, start date, end date, premium amount)
- Submit buttons are disabled until all required fields are valid
- Confirmation dialog required for delete operations
- Sequential policy IDs assigned automatically

---

## Test Scenarios

### 1. Policy Creation - Happy Path

**Seed:** `e2e/tests/seed.spec.ts`

#### 1.1 Create Valid Policy with All Required Fields
**Steps:**
1. Navigate to `/policies`
2. Click the "+ Add Policy" button
3. Fill in Policy Number field: "POL-123"
4. Fill in Customer Name field: "John Smith"
5. Fill in Start Date field: "2024-01-01"
6. Fill in End Date field: "2024-12-31"
7. Fill in Premium Amount field: "1500"
8. Click "Create Policy" button

**Expected Results:**
- Form navigation occurs successfully to `/policies/new`
- All form fields accept input
- "Create Policy" button becomes enabled after all fields are filled
- After submission, user is redirected to `/policies`
- New policy appears in the list table
- Policy displays as: POL-123, John Smith, $1500.00
- Table has headers: Policy Number, Customer Name, Premium Amount, Actions
- Each row has Edit and Delete buttons

#### 1.2 Create Policy with Different Date Ranges
**Steps:**
1. Navigate to `/policies`
2. Click "+ Add Policy" button
3. Create policy with same-day coverage:
   - Policy Number: "POL-SAME-DAY"
   - Customer Name: "Test User"
   - Start Date: "2024-06-15"
   - End Date: "2024-06-15"
   - Premium Amount: "100"
4. Click "Create Policy"

**Expected Results:**
- System accepts same start and end date
- Policy is created successfully
- Policy appears in list with correct dates

#### 1.3 Create Policy with Long-Term Coverage
**Steps:**
1. Navigate to `/policies`
2. Click "+ Add Policy" button
3. Create policy with multi-year coverage:
   - Policy Number: "POL-LONG"
   - Customer Name: "Long Term Customer"
   - Start Date: "2024-01-01"
   - End Date: "2029-12-31"
   - Premium Amount: "25000"
4. Click "Create Policy"

**Expected Results:**
- System accepts date range spanning multiple years
- Large premium amount (25000) is accepted
- Premium displays correctly as $25000.00

#### 1.4 Create Policy with Decimal Premium Amount
**Steps:**
1. Navigate to `/policies`
2. Click "+ Add Policy" button
3. Fill in all fields with:
   - Policy Number: "POL-DECIMAL"
   - Customer Name: "Jane Doe"
   - Start Date: "2024-03-01"
   - End Date: "2024-03-31"
   - Premium Amount: "999.99"
4. Click "Create Policy"

**Expected Results:**
- Decimal values are accepted in premium field
- Premium displays as $999.99 in the list
- No rounding errors occur

#### 1.5 Create Multiple Policies in Sequence
**Steps:**
1. Navigate to `/policies`
2. Create first policy (POL-001, Customer A, 2024-01-01 to 2024-12-31, 1000)
3. After redirect to list, click "+ Add Policy" again
4. Create second policy (POL-002, Customer B, 2024-02-01 to 2025-01-31, 2000)
5. After redirect, click "+ Add Policy" again
6. Create third policy (POL-003, Customer C, 2024-03-01 to 2024-06-30, 1500)

**Expected Results:**
- All three policies are created successfully
- Each policy gets a unique internal ID
- All policies appear in the list
- List displays all three policies with correct data
- No data from previous form submissions carries over

---

### 2. Form Validation and Error Handling

**Seed:** `e2e/tests/seed.spec.ts`

#### 2.1 Submit Button Disabled When Form Invalid
**Steps:**
1. Navigate to `/policies/new`
2. Observe the "Create Policy" button state without filling any fields

**Expected Results:**
- "Create Policy" button is disabled (not clickable)
- Button appears visually disabled
- Button remains disabled until all required fields have valid data

#### 2.2 Validate Policy Number Required
**Steps:**
1. Navigate to `/policies/new`
2. Leave Policy Number field empty
3. Fill in Customer Name: "Test Customer"
4. Fill in Start Date: "2024-01-01"
5. Fill in End Date: "2024-12-31"
6. Fill in Premium Amount: "1000"
7. Click on Policy Number field and then click outside (blur)

**Expected Results:**
- "Create Policy" button remains disabled
- Error message "Policy number is required" appears below Policy Number field
- Error message appears only after field is touched/blurred

#### 2.3 Validate Customer Name Required
**Steps:**
1. Navigate to `/policies/new`
2. Fill in Policy Number: "POL-TEST"
3. Leave Customer Name empty
4. Fill in Start Date: "2024-01-01"
5. Fill in End Date: "2024-12-31"
6. Fill in Premium Amount: "1000"
7. Click on Customer Name field and then click outside (blur)

**Expected Results:**
- "Create Policy" button remains disabled
- Error message "Customer name is required" appears below Customer Name field
- Error message appears only after field is touched/blurred

#### 2.4 Validate Start Date Required
**Steps:**
1. Navigate to `/policies/new`
2. Fill in Policy Number: "POL-TEST"
3. Fill in Customer Name: "Test Customer"
4. Leave Start Date empty
5. Fill in End Date: "2024-12-31"
6. Fill in Premium Amount: "1000"
7. Click on Start Date field and then click outside (blur)

**Expected Results:**
- "Create Policy" button remains disabled
- Error message "Start date is required" appears below Start Date field
- Error message appears only after field is touched/blurred

#### 2.5 Validate End Date Required
**Steps:**
1. Navigate to `/policies/new`
2. Fill in Policy Number: "POL-TEST"
3. Fill in Customer Name: "Test Customer"
4. Fill in Start Date: "2024-01-01"
5. Leave End Date empty
6. Fill in Premium Amount: "1000"
7. Click on End Date field and then click outside (blur)

**Expected Results:**
- "Create Policy" button remains disabled
- Error message "End date is required" appears below End Date field
- Error message appears only after field is touched/blurred

#### 2.6 Validate Premium Amount Required
**Steps:**
1. Navigate to `/policies/new`
2. Fill in Policy Number: "POL-TEST"
3. Fill in Customer Name: "Test Customer"
4. Fill in Start Date: "2024-01-01"
5. Fill in End Date: "2024-12-31"
6. Clear Premium Amount field (default is 0)
7. Click on Premium Amount field and then click outside (blur)

**Expected Results:**
- If premium is 0, verify if this is accepted or rejected
- Premium Amount field should show appropriate validation state
- Error message appears if 0 is not a valid premium

#### 2.7 Validate All Fields Empty
**Steps:**
1. Navigate to `/policies/new`
2. Click on each field in sequence and then click outside without entering data:
   - Click Policy Number → blur
   - Click Customer Name → blur
   - Click Start Date → blur
   - Click End Date → blur
   - Click Premium Amount → blur

**Expected Results:**
- All five required field error messages appear
- "Create Policy" button remains disabled
- Each error message displays: "[Field name] is required"

#### 2.8 Invalid Date Format Prevention
**Steps:**
1. Navigate to `/policies/new`
2. Try to enter invalid date formats in Start Date field:
   - Attempt to type "13/32/2024"
   - Attempt to type "invalid"
   - Attempt to type "2024-13-32"

**Expected Results:**
- HTML5 date picker prevents invalid date entry
- Only valid dates can be selected/entered
- Date field accepts only YYYY-MM-DD format

#### 2.9 Negative Premium Amount
**Steps:**
1. Navigate to `/policies/new`
2. Fill in all required fields
3. Enter "-500" in Premium Amount field
4. Attempt to submit

**Expected Results:**
- System should prevent negative premium amounts (min="0" attribute)
- Field validation should reject negative values
- Submit button should remain disabled or form should not submit

---

### 3. Policy Editing

**Seed:** `e2e/tests/seed.spec.ts`

#### 3.1 Edit Existing Policy - All Fields
**Steps:**
1. Navigate to `/policies`
2. Create a test policy (POL-EDIT, John Doe, 2024-01-01 to 2024-12-31, 1500)
3. Click "Edit" button for the created policy
4. Verify form is pre-populated with existing data
5. Modify Policy Number to "POL-EDITED"
6. Modify Customer Name to "Jane Doe"
7. Modify Start Date to "2024-02-01"
8. Modify End Date to "2025-01-31"
9. Modify Premium Amount to "2500"
10. Click "Update Policy" button

**Expected Results:**
- Navigation occurs to `/policies/[id]/edit`
- Form header shows "Edit Policy" instead of "Add New Policy"
- Breadcrumb shows "Policies / Edit"
- All fields are pre-populated with current policy data
- All fields can be modified
- Button text shows "Update Policy" instead of "Create Policy"
- After submission, redirects to `/policies`
- Policy in list reflects all updated values
- Policy maintains same internal ID

#### 3.2 Edit Policy - Single Field Change
**Steps:**
1. Create a test policy
2. Click "Edit" for that policy
3. Change only Customer Name from "John Doe" to "John Smith"
4. Click "Update Policy"

**Expected Results:**
- Only the modified field is updated
- All other fields remain unchanged
- Policy appears correctly in list with single change

#### 3.3 Edit Policy - Premium Amount Only
**Steps:**
1. Create a test policy with premium $1500.00
2. Click "Edit" for that policy
3. Change only Premium Amount to "3000"
4. Click "Update Policy"

**Expected Results:**
- Premium updates to $3000.00
- All other fields remain unchanged
- Currency formatting is correct

#### 3.4 Edit Policy - Date Range Modification
**Steps:**
1. Create a test policy (2024-01-01 to 2024-12-31)
2. Click "Edit" for that policy
3. Change Start Date to "2024-06-01"
4. Change End Date to "2024-12-31" (keep same)
5. Click "Update Policy"

**Expected Results:**
- Date range is successfully updated
- Policy reflects new coverage period
- No validation errors for valid date range

#### 3.5 Edit Form Validation
**Steps:**
1. Create a test policy
2. Click "Edit" for that policy
3. Clear the Customer Name field
4. Attempt to click "Update Policy"

**Expected Results:**
- "Update Policy" button becomes disabled
- Validation error appears: "Customer name is required"
- Form cannot be submitted until valid

#### 3.6 Cancel Edit Operation
**Steps:**
1. Create a test policy (POL-CANCEL, Original Name, 2024-01-01 to 2024-12-31, 1500)
2. Click "Edit" for that policy
3. Modify Customer Name to "Changed Name"
4. Modify Premium Amount to "9999"
5. Click "Cancel" button

**Expected Results:**
- Redirects to `/policies` without saving changes
- Policy in list shows original unchanged values
- No data is modified in storage

---

### 4. Policy Deletion

**Seed:** `e2e/tests/seed.spec.ts`

#### 4.1 Delete Policy with Confirmation
**Steps:**
1. Navigate to `/policies`
2. Create a test policy (POL-DELETE, Test User, 2024-01-01 to 2024-12-31, 1000)
3. Click "Delete" button for the created policy
4. Observe confirmation dialog
5. Click "OK" or "Yes" to confirm deletion

**Expected Results:**
- Confirmation dialog appears with message: "Are you sure you want to delete this policy?"
- Upon confirmation, policy is removed from the list
- Page remains at `/policies`
- Policy no longer appears in any list view
- No error occurs

#### 4.2 Cancel Delete Operation
**Steps:**
1. Create a test policy
2. Click "Delete" button for that policy
3. Confirmation dialog appears
4. Click "Cancel" to dismiss dialog

**Expected Results:**
- Dialog is dismissed without action
- Policy remains in the list unchanged
- No data is deleted

#### 4.3 Delete Multiple Policies
**Steps:**
1. Create three test policies:
   - POL-001, Customer A, 2024-01-01 to 2024-12-31, 1000
   - POL-002, Customer B, 2024-01-01 to 2024-12-31, 1500
   - POL-003, Customer C, 2024-01-01 to 2024-12-31, 2000
2. Delete the first policy (POL-001) and confirm
3. Delete the third policy (POL-003) and confirm
4. Verify remaining policy

**Expected Results:**
- POL-001 is removed after first deletion
- POL-003 is removed after second deletion
- POL-002 remains in the list
- Only one policy (POL-002) is displayed
- No errors occur during multiple deletions

#### 4.4 Delete Last Remaining Policy
**Steps:**
1. Ensure only one policy exists in the system
2. Click "Delete" for that policy
3. Confirm deletion

**Expected Results:**
- Policy is deleted successfully
- Empty state appears showing:
  - Icon (📋)
  - "No policies yet" heading
  - Message: "Get started by adding your first insurance policy"
  - "+ Add Your First Policy" button
- No errors occur
- Empty state is user-friendly

#### 4.5 Attempt Delete During Edit
**Steps:**
1. Create a test policy
2. Click "Edit" for that policy
3. In another browser tab/window, navigate to `/policies`
4. Delete the same policy
5. In the edit tab, try to save changes

**Expected Results:**
- System should handle gracefully (edge case)
- Either error message appears or redirect occurs
- No data corruption occurs

---

### 5. Navigation and Routing

**Seed:** `e2e/tests/seed.spec.ts`

#### 5.1 Navigate from List to Add Form
**Steps:**
1. Navigate to `/policies`
2. Click "+ Add Policy" button
3. Verify URL and page content

**Expected Results:**
- URL changes to `/policies/new`
- "Add New Policy" heading is displayed
- Breadcrumb shows "Policies / New"
- Empty form is displayed
- Cancel and Create Policy buttons are present

#### 5.2 Navigate from Add Form to List (Cancel)
**Steps:**
1. Navigate to `/policies/new`
2. Fill in some fields (partial form completion)
3. Click "Cancel" button

**Expected Results:**
- URL changes to `/policies`
- "Insurance Policies" heading is displayed
- Policy list is shown (or empty state if no policies)
- No policy is created
- Data entered in form is not saved

#### 5.3 Navigate from List to Edit Form
**Steps:**
1. Create a test policy
2. From list view, click "Edit" button for that policy
3. Verify URL and page content

**Expected Results:**
- URL changes to `/policies/[id]/edit` (e.g., `/policies/1/edit`)
- "Edit Policy" heading is displayed
- Breadcrumb shows "Policies / Edit"
- Form is pre-populated with policy data
- Cancel and Update Policy buttons are present

#### 5.4 Navigate from Edit Form to List (Cancel)
**Steps:**
1. Navigate to edit form for existing policy
2. Make changes to some fields
3. Click "Cancel" button

**Expected Results:**
- URL changes to `/policies`
- Policy list is displayed
- Changes made in form are not saved
- Original policy data remains intact

#### 5.5 Direct URL Access - List Page
**Steps:**
1. Open browser and navigate directly to `http://localhost:4222/policies`

**Expected Results:**
- Page loads successfully
- Policies list is displayed (or empty state)
- Application is fully functional
- No routing errors

#### 5.6 Direct URL Access - Add Form
**Steps:**
1. Open browser and navigate directly to `http://localhost:4222/policies/new`

**Expected Results:**
- Add form loads successfully
- Empty form is displayed
- All fields are ready for input
- Form is fully functional

#### 5.7 Direct URL Access - Edit Form with Valid ID
**Steps:**
1. Create a policy and note its ID (e.g., ID=1)
2. Navigate directly to `http://localhost:4222/policies/1/edit`

**Expected Results:**
- Edit form loads successfully
- Form is pre-populated with correct policy data
- Form is fully functional
- Update and Cancel buttons work correctly

#### 5.8 Direct URL Access - Edit Form with Invalid ID
**Steps:**
1. Navigate directly to `http://localhost:4222/policies/999/edit` (non-existent ID)

**Expected Results:**
- Application handles gracefully
- Either shows empty form, error message, or redirects to list
- No JavaScript errors in console
- User can navigate back to list

#### 5.9 Breadcrumb Navigation
**Steps:**
1. Navigate to `/policies/new`
2. Click "Policies" link in breadcrumb

**Expected Results:**
- Returns to `/policies` list view
- Breadcrumb link is clickable and functional

---

### 6. Empty State and First-Time User Experience

**Seed:** `e2e/tests/seed.spec.ts`

#### 6.1 Empty State Display
**Steps:**
1. Navigate to `/policies` with no existing policies (fresh state)
2. Observe the empty state

**Expected Results:**
- Empty state is displayed instead of empty table
- Icon is shown (📋)
- Heading displays: "No policies yet"
- Helper text displays: "Get started by adding your first insurance policy"
- "+ Add Your First Policy" button is prominently displayed
- Regular "+ Add Policy" header button is also visible

#### 6.2 Add First Policy from Empty State
**Steps:**
1. Navigate to `/policies` (empty state)
2. Click "+ Add Your First Policy" button
3. Fill in valid policy data
4. Submit form

**Expected Results:**
- Button navigates to `/policies/new`
- Form works identically to regular add flow
- After submission, empty state disappears
- Policy table is displayed with the new policy

#### 6.3 Empty State After Deleting All Policies
**Steps:**
1. Create two policies
2. Delete the first policy
3. Delete the second policy

**Expected Results:**
- After deleting last policy, empty state reappears
- Empty state display matches initial empty state
- "+ Add Your First Policy" button is functional

---

### 7. Data Persistence and Local Storage

**Seed:** `e2e/tests/seed.spec.ts`

#### 7.1 Policy Data Persists After Page Refresh
**Steps:**
1. Create three test policies with distinct data
2. Refresh the browser page (F5 or Ctrl+R)
3. Observe policy list

**Expected Results:**
- All three policies remain in the list after refresh
- Data is accurate and unchanged
- IDs are maintained
- Order is preserved

#### 7.2 Sequential ID Assignment
**Steps:**
1. Create first policy (should get ID=1)
2. Create second policy (should get ID=2)
3. Delete second policy
4. Create third policy (should get ID=3, not reuse ID=2)

**Expected Results:**
- IDs are assigned sequentially
- Deleted IDs are not reused
- ID counter continues incrementing
- No ID conflicts occur

#### 7.3 Edit Changes Persist After Refresh
**Steps:**
1. Create a policy
2. Edit the policy and change multiple fields
3. Save changes
4. Refresh the page
5. View the policy in the list

**Expected Results:**
- Edited changes are present after refresh
- No data loss occurs
- Changes are accurately reflected

#### 7.4 Data Isolation Between Browser Sessions
**Steps:**
1. In Chrome, create two policies
2. Open same application in Firefox or a different browser
3. Observe policy list in second browser

**Expected Results:**
- Second browser shows empty state or different data
- Data is isolated per browser/profile
- No cross-browser data sharing occurs

#### 7.5 Multiple Tab Synchronization
**Steps:**
1. Open application in Tab 1
2. Create a policy in Tab 1
3. Open application in Tab 2 (same browser)
4. Refresh Tab 2
5. Observe if policy appears in Tab 2

**Expected Results:**
- Policy created in Tab 1 appears in Tab 2 after refresh
- Local storage is shared between tabs of same browser
- Data consistency is maintained

---

### 8. User Interface and Styling

**Seed:** `e2e/tests/seed.spec.ts`

#### 8.1 Policy List Table Layout
**Steps:**
1. Create multiple policies
2. Observe table structure and styling

**Expected Results:**
- Table has clear headers: Policy Number, Customer Name, Premium Amount, Actions
- Data is aligned properly in columns
- Edit and Delete buttons are clearly visible
- Table is responsive and readable
- No UI overflow or layout issues

#### 8.2 Form Layout and Styling
**Steps:**
1. Navigate to Add/Edit form
2. Observe form layout

**Expected Results:**
- Form fields are clearly labeled
- Required fields are marked with red asterisk (*)
- Fields are logically grouped (dates in same row)
- Form is centered and well-spaced
- Helper text for Premium Amount is visible
- Buttons are clearly styled and positioned

#### 8.3 Currency Formatting
**Steps:**
1. Create policies with various premium amounts:
   - 100 (should display as $100.00)
   - 1500 (should display as $1500.00)
   - 12345.67 (should display as $12345.67)
   - 999.9 (should display as $999.90)

**Expected Results:**
- All premium amounts display with $ prefix
- All amounts show exactly 2 decimal places
- Thousands are not separated with commas (or are, consistently)
- Formatting is consistent across all policies

#### 8.4 Button States and Styling
**Steps:**
1. Navigate to Add form
2. Observe button states:
   - Before filling form (Create Policy disabled)
   - After filling form (Create Policy enabled)
   - Hover over Cancel button
   - Hover over Create Policy button

**Expected Results:**
- Disabled buttons appear visually different (grayed out)
- Enabled buttons have appropriate styling
- Hover states provide visual feedback
- Buttons have consistent styling throughout app

#### 8.5 Error Message Styling
**Steps:**
1. Navigate to Add form
2. Touch each field and blur without entering data
3. Observe error messages

**Expected Results:**
- Error messages are red or clearly indicate error state
- Error messages appear below respective fields
- Messages are readable and appropriately sized
- Multiple error messages can appear simultaneously

#### 8.6 Header and Title Display
**Steps:**
1. Navigate through different pages:
   - List view
   - Add form
   - Edit form

**Expected Results:**
- Each page has clear heading (h2)
- Headings are contextually correct
- Breadcrumbs update appropriately
- Page title in browser tab is consistent

---

### 9. Edge Cases and Boundary Testing

**Seed:** `e2e/tests/seed.spec.ts`

#### 9.1 Very Long Policy Number
**Steps:**
1. Navigate to Add form
2. Enter very long policy number (100+ characters)
3. Fill remaining fields with valid data
4. Submit form

**Expected Results:**
- System accepts or truncates long policy number
- No UI overflow in list view
- Data is stored correctly
- No JavaScript errors

#### 9.2 Very Long Customer Name
**Steps:**
1. Navigate to Add form
2. Enter very long customer name (100+ characters)
3. Fill remaining fields with valid data
4. Submit form

**Expected Results:**
- System accepts or truncates long customer name
- No UI overflow in table
- Data is stored correctly
- Text wraps or truncates appropriately in list

#### 9.3 Special Characters in Text Fields
**Steps:**
1. Create policy with special characters:
   - Policy Number: "POL-2024/Q1#@!"
   - Customer Name: "O'Brien & Sons, Inc."
2. Submit form
3. View in list
4. Edit the policy

**Expected Results:**
- Special characters are accepted
- Characters display correctly in list
- Characters are preserved when editing
- No encoding issues

#### 9.4 Very Large Premium Amount
**Steps:**
1. Create policy with premium: "999999999999"
2. Submit form
3. Observe display in list

**Expected Results:**
- Large number is accepted
- Currency formatting handles large numbers
- No number overflow or display issues
- Value is stored accurately

#### 9.5 Zero Premium Amount
**Steps:**
1. Create policy with premium: "0"
2. Attempt to submit form

**Expected Results:**
- System should validate if 0 is acceptable
- Either accepts and displays $0.00, or shows validation error
- Behavior is consistent with business rules

#### 9.6 End Date Before Start Date
**Steps:**
1. Navigate to Add form
2. Fill Start Date: "2024-12-31"
3. Fill End Date: "2024-01-01"
4. Fill remaining fields
5. Attempt to submit

**Expected Results:**
- System should validate date logic
- Error message should indicate end date must be after start date
- Form should not submit with invalid date range
- (Note: If no validation exists, this is a bug to report)

#### 9.7 Dates in Distant Past
**Steps:**
1. Create policy with dates:
   - Start Date: "1900-01-01"
   - End Date: "1900-12-31"
2. Submit form

**Expected Results:**
- Old dates are accepted (no future/current date validation)
- Dates display correctly
- Policy is created successfully

#### 9.8 Dates in Distant Future
**Steps:**
1. Create policy with dates:
   - Start Date: "2099-01-01"
   - End Date: "2099-12-31"
2. Submit form

**Expected Results:**
- Future dates are accepted
- Dates display correctly
- Policy is created successfully

#### 9.9 Unicode Characters in Customer Name
**Steps:**
1. Create policy with customer name: "李明 (Lǐ Míng) 中文"
2. Submit form
3. View and edit policy

**Expected Results:**
- Unicode characters are accepted
- Characters display correctly everywhere
- No encoding corruption occurs
- Data is preserved accurately

#### 9.10 Rapid Consecutive Form Submissions
**Steps:**
1. Navigate to Add form
2. Fill valid data
3. Click "Create Policy" button multiple times rapidly

**Expected Results:**
- Only one policy is created
- No duplicate policies appear
- Button becomes disabled after first click
- User is redirected only once

---

### 10. Performance and Usability

**Seed:** `e2e/tests/seed.spec.ts`

#### 10.1 Large Number of Policies Display
**Steps:**
1. Create 50 policies with varying data
2. Navigate to policy list
3. Observe performance and display

**Expected Results:**
- All 50 policies load and display
- Page renders without significant delay
- Scrolling is smooth
- No performance degradation
- Table remains readable

#### 10.2 Form Auto-focus Behavior
**Steps:**
1. Navigate to `/policies/new`
2. Observe which field has focus by default

**Expected Results:**
- Policy Number field should have auto-focus (cursor ready)
- User can immediately start typing
- Tab order flows logically through form

#### 10.3 Keyboard Navigation - Tab Order
**Steps:**
1. Navigate to Add form
2. Use Tab key to navigate through fields
3. Verify tab order

**Expected Results:**
- Tab order flows logically: Policy Number → Customer Name → Start Date → End Date → Premium Amount → Cancel → Create Policy
- Shift+Tab reverses direction
- Tab does not skip or trap in any field

#### 10.4 Enter Key Submission
**Steps:**
1. Navigate to Add form
2. Fill all required fields
3. Press Enter key (instead of clicking button)

**Expected Results:**
- Form submits successfully
- Policy is created
- Redirects to list view

#### 10.5 Loading States (if applicable)
**Steps:**
1. Create policy and observe any loading states during submission
2. Delete policy and observe any loading states

**Expected Results:**
- Loading indicators appear if operations take time
- User receives feedback that action is processing
- UI is not frozen or unresponsive

---

### 11. Cross-Browser Compatibility (Manual Testing)

**Seed:** `e2e/tests/seed.spec.ts`

#### 11.1 Chrome/Chromium Functionality
**Steps:**
1. Open application in Google Chrome
2. Test core flows: Create, Read, Update, Delete
3. Verify date picker appearance and functionality
4. Test local storage persistence

**Expected Results:**
- All features work correctly in Chrome
- Date pickers display natively
- No console errors
- UI renders correctly

#### 11.2 Firefox Functionality
**Steps:**
1. Open application in Firefox
2. Test core flows: Create, Read, Update, Delete
3. Verify date picker appearance and functionality
4. Test local storage persistence

**Expected Results:**
- All features work correctly in Firefox
- Date pickers may look different but function correctly
- No console errors
- UI renders correctly

#### 11.3 Safari Functionality
**Steps:**
1. Open application in Safari (macOS/iOS)
2. Test core flows: Create, Read, Update, Delete
3. Verify date picker appearance and functionality
4. Test local storage persistence

**Expected Results:**
- All features work correctly in Safari
- Date pickers display natively
- No console errors
- UI renders correctly

#### 11.4 Edge Functionality
**Steps:**
1. Open application in Microsoft Edge
2. Test core flows: Create, Read, Update, Delete
3. Verify date picker appearance and functionality
4. Test local storage persistence

**Expected Results:**
- All features work correctly in Edge
- Date pickers display natively
- No console errors
- UI renders correctly

---

### 12. Accessibility Testing

**Seed:** `e2e/tests/seed.spec.ts`

#### 12.1 Keyboard-Only Navigation
**Steps:**
1. Navigate through entire application using only keyboard
2. Create, edit, and delete policies without using mouse

**Expected Results:**
- All interactive elements are reachable via keyboard
- Tab order is logical
- Focus indicators are visible
- All actions can be completed without mouse

#### 12.2 Screen Reader Labels
**Steps:**
1. Use screen reader (NVDA, JAWS, or VoiceOver)
2. Navigate through forms and list
3. Verify all elements have proper labels

**Expected Results:**
- Form fields announce their labels
- Buttons announce their purpose
- Required fields are indicated
- Error messages are announced
- Table structure is properly conveyed

#### 12.3 Form Label Associations
**Steps:**
1. Click on text label "Policy Number"
2. Verify focus moves to input field

**Expected Results:**
- Labels are properly associated with inputs
- Clicking label focuses corresponding input
- This works for all form fields

#### 12.4 Color Contrast
**Steps:**
1. Visually inspect or use accessibility checker tool
2. Verify text and background colors meet WCAG standards

**Expected Results:**
- All text has sufficient contrast
- Error messages are readable
- Disabled buttons are distinguishable
- No reliance on color alone for information

---

### 13. Regression Testing Scenarios

**Seed:** `e2e/tests/seed.spec.ts`

#### 13.1 Complete CRUD Cycle
**Steps:**
1. Start with empty state
2. Create a policy (POL-TEST, John Doe, 2024-01-01 to 2024-12-31, 1500)
3. Verify policy appears in list
4. Edit policy (change name to Jane Doe, premium to 2000)
5. Verify changes appear in list
6. Delete policy
7. Verify empty state reappears

**Expected Results:**
- All CRUD operations complete successfully
- Data accuracy is maintained throughout
- UI updates correctly after each operation
- No errors or inconsistencies

#### 13.2 Cancel Operations Do Not Modify Data
**Steps:**
1. Create a policy
2. Click Edit, make changes, click Cancel
3. Verify original data unchanged
4. Click Add, enter data, click Cancel
5. Verify no policy was created
6. Click Delete, click Cancel in confirmation
7. Verify policy still exists

**Expected Results:**
- Cancel operations at every stage preserve data
- No unintended modifications occur
- Data integrity is maintained

#### 13.3 Validation Remains Consistent
**Steps:**
1. In Add form, trigger all validation errors
2. In Edit form, trigger all validation errors
3. Verify error messages and behavior are identical

**Expected Results:**
- Validation rules are consistent between Add and Edit
- Error messages are identical
- Required field behavior is same

---

## Test Data Reference

### Valid Test Data Sets

**Standard Policy:**
- Policy Number: POL-001
- Customer Name: John Smith
- Start Date: 2024-01-01
- End Date: 2024-12-31
- Premium Amount: 1500

**Alternative Policy:**
- Policy Number: POL-002
- Customer Name: Jane Doe
- Start Date: 2024-06-01
- End Date: 2025-05-31
- Premium Amount: 2500.50

**Edge Case Policy:**
- Policy Number: POL-SPECIAL-2024/Q1
- Customer Name: O'Brien & Associates, Inc.
- Start Date: 2024-01-01
- End Date: 2024-03-31
- Premium Amount: 999.99

### Invalid Test Data Sets (for validation testing)

**Missing Required Fields:**
- Policy Number: (empty)
- Customer Name: (empty)
- Start Date: (empty)
- End Date: (empty)
- Premium Amount: (empty or 0)

**Boundary Values:**
- Premium Amount: 0, 0.01, -100, 999999999
- Dates: 1900-01-01, 2099-12-31
- Policy Number: 100+ characters
- Customer Name: 100+ characters

---

## Notes for Testers

1. **Fresh State**: Each test scenario assumes a blank/fresh state unless otherwise specified. Clear local storage or use incognito mode for consistent test results.

2. **Date Format**: Date inputs require YYYY-MM-DD format (HTML5 standard). Browser date pickers may display differently across browsers.

3. **Currency Display**: Premium amounts are displayed with $ symbol and exactly 2 decimal places in list view, but input as plain numbers in forms.

4. **Confirmation Dialogs**: Delete operations always require confirmation. Test both confirm and cancel paths.

5. **Local Storage**: Application uses browser local storage for persistence. Data persists across sessions but is browser-specific.

6. **No Backend**: Application is frontend-only with local storage. No API calls or server-side validation.

7. **Test ID Attributes**: Application uses `data-testid` attributes for reliable test automation targeting.

8. **Responsive Design**: While not explicitly tested in this plan, verify application works on different screen sizes if responsive design is a requirement.

9. **Browser Console**: Monitor browser console for any JavaScript errors or warnings during testing.

10. **Sequential Testing**: Some scenarios build on previous actions. When running full test suite, consider dependencies between tests.

---

## Success Criteria

A test is considered **passed** if:
- All steps can be completed without errors
- All expected results are observed
- No JavaScript console errors occur
- Data integrity is maintained
- UI renders correctly and is usable

A test is considered **failed** if:
- Any expected result does not occur
- JavaScript errors appear in console
- Data is corrupted or lost
- UI is broken or unusable
- Navigation fails or routes incorrectly

---

## Test Execution Summary

**Total Scenarios**: 13 major categories
**Total Test Cases**: 80+ individual test cases
**Estimated Execution Time**: 4-6 hours for complete manual execution
**Automation Potential**: High - most scenarios can be automated with Playwright
**Priority**: All CRUD scenarios (categories 1-4) are P0, others are P1-P2

---

## Recommended Test Execution Order

1. Start with Category 1 (Policy Creation - Happy Path)
2. Then Category 2 (Form Validation)
3. Then Category 3 (Policy Editing)
4. Then Category 4 (Policy Deletion)
5. Then Category 5 (Navigation)
6. Proceed with remaining categories in any order
7. End with Category 13 (Regression Testing)

This order ensures core functionality is verified first before moving to edge cases and advanced scenarios.
