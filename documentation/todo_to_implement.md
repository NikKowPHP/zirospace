# TODO: Implement Contact Form with Email Sending

This plan outlines the steps to implement a contact form at the end of the landing page. The form will collect user input (Name, Email, Telephone, Message) and submit it, intended to be processed by a service like Getform.io for email sending.

## Phase 1: Basic Form Structure (Frontend)

-[x] Task 1.1: Identify Target Component and Add Basic HTML Form Structure
Objective: Create the fundamental HTML elements for the form.
File to Modify: src/components/sections/contact-form/contact-form.tsx
Implementation Steps:
[x] Wrap the form elements in a <form> tag.
[x] Add an <input type="text"> for "Name".
[x] Add an <input type="email"> for "Email".
[x] Add an <input type="tel"> for "Telephone".
[x] Add a <textarea> for "Message".
[x] Add a <button type="submit"> for "Submit".

- [x] **Task 1.2: Add Labels for Form Fields**
    *   **Objective:** Provide accessible labels for each form input.
    *   **File to Modify:** `src/components/sections/contact-form/contact-form.tsx`
    *   **Implementation Steps:**
        - [x] Add a `<label htmlFor="name">` for the Name input.
        - [x] Add a `<label htmlFor="email">` for the Email input.
        - [x] Add a `<label htmlFor="telephone">` for the Telephone input.
        - [x] Add a `<label htmlFor="message">` for the Message textarea.

- [x] **Task 1.3: Apply Basic Styling for Form Layout**
    *   **Objective:** Arrange form elements using Tailwind CSS for initial layout.
    *   **File to Modify:** `src/components/sections/contact-form/contact-form.tsx`
    *   **Implementation Steps:**
        - [x] Style the main `<form>` container to manage the vertical arrangement of field groups (label + input). Use flex column and gap.
        - [x] Style each field group (div containing label and input/textarea) for proper spacing.

- [x] **Task 1.4: Style Input Fields and Textarea**
    *   **Objective:** Apply consistent styling to all input fields and the textarea.
    *   **File to Modify:** `src/components/sections/contact-form/contact-form.tsx`
    *   **Implementation Steps:**
        - [x] Apply Tailwind classes for padding (e.g., `px-4 py-2`), borders (e.g., `border rounded-md`), width (e.g., `w-full`), and focus states (e.g., `focus:outline-none focus:ring-1 focus:ring-blue-600`) to all `<input>` elements.
        - [x] Apply similar Tailwind classes to the `<textarea>`.

- [x] **Task 1.5: Style the Submit Button**
    *   **Objective:** Style the submit button to match the primary action button style.
    *   **File to Modify:** `src/components/sections/contact-form/contact-form.tsx`
    *   **Implementation Steps:**
        - [x] Apply Tailwind classes for background color (e.g., `bg-primary`), text color (e.g., `text-white`), padding (e.g., `px-4 py-2`), rounded corners (e.g., `rounded-md`), and full width (e.g., `w-full`).
        - [x] Use the existing `Button` component from `src/components/ui/button/button.tsx` if appropriate, configuring its variant and size.

## Phase 2: Internationalization (i18n)

- [x] **Task 2.1: Add Translation Keys in English**
    *   **Objective:** Define English translations for all form-related text.
    *   **File to Modify:** `src/messages/en.json`
    *   **Implementation Steps:**
        - [x] Add a new top-level key, e.g., `"contactUsFormSection"`.
        - [x] Inside `"contactUsFormSection"`, add keys for:
            - `title`: "Start Your Digital Health Journey with Us"
            - `name`: "Name" (for label and placeholder)
            - `email`: "Email" (for label and placeholder)
            - `telephone`: "Telephone" (for label and placeholder)
            - `message`: "Message" (for label and placeholder)
            - `submit`: "Submit" (for button text)

- [x] **Task 2.2: Add Translation Keys in Polish**
    *   **Objective:** Define Polish translations for all form-related text.
    *   **File to Modify:** `src/messages/pl.json`
    *   **Implementation Steps:**
        - [x] Add a new top-level key, e.g., `"contactUsFormSection"`.
        - [x] Inside `"contactUsFormSection"`, add Polish translations corresponding to the English keys from Task 2.1.

- [x] **Task 2.3: Implement `useTranslations` in the Form Component**
    *   **Objective:** Use the i18n hook to display translated text.
    *   **File to Modify:** `src/components/sections/contact-form/contact-form.tsx`
    *   **Implementation Steps:**
        - [x] Import `useTranslations` from `next-intl`.
        - [x] Initialize `const t = useTranslations('contactUsFormSection');`.
        - [x] Replace static text for the section title with `t('title')`.
        - [x] Replace static text for labels with `t('name')`, `t('email')`, etc.
        - [x] Replace static text for the submit button with `t('submit')`.

- [x] **Task 2.4: Add Placeholder Text and Internationalize Them**
    *   **Objective:** Add placeholder attributes to input fields and make them translatable.
    *   **Files to Modify:** `src/messages/en.json`, `src/messages/pl.json`, `src/components/sections/contact-form/contact-form.tsx`
    *   **Implementation Steps:**
        - [x] In `en.json` (under `contactUsFormSection`), add placeholder keys: e.g., `namePlaceholder`, `emailPlaceholder`, etc.
        - [x] In `pl.json`, add corresponding Polish placeholder keys.
        - [x] In `contact-form.tsx`, set the `placeholder` attribute of each input/textarea using `t('keyPlaceholder')`.

## Phase 3: Form Submission Setup (Getform.io)

- [ ] **Task 3.1: (User Task) Create Getform.io Account and Endpoint**
    *   **Objective:** User needs to manually create a Getform.io account and obtain their unique form endpoint URL.
    *   **Action:** This step is for the user to perform outside of AI interaction. The AI should note this dependency.
    *   **Output:** User provides the Getform.io endpoint URL.

- [ ] **Task 3.2: Configure HTML Form for Getform.io Submission**
    *   **Objective:** Set the form's `action`, `method`, and `enctype` attributes for Getform.io.
    *   **File to Modify:** `src/components/sections/contact-form/contact-form.tsx`
    *   **Implementation Steps:**
        - [ ] Set the `<form>` `action` attribute to the Getform.io endpoint URL (use a placeholder like `"YOUR_GETFORM_ENDPOINT_URL"` initially, to be replaced by the user).
        - [ ] Set the `<form>` `method` attribute to `POST`.
        - [ ] Set the `<form>` `enctype` attribute to `multipart/form-data`.

- [ ] **Task 3.3: Add `name` Attributes to Form Input Fields**
    *   **Objective:** Ensure each form field has a `name` attribute so its data is included in the submission.
    *   **File to Modify:** `src/components/sections/contact-form/contact-form.tsx`
    *   **Implementation Steps:**
        - [ ] Add `name="name"` to the Name input.
        - [ ] Add `name="email"` to the Email input.
        - [ ] Add `name="telephone"` to the Telephone input.
        - [ ] Add `name="message"` to the Message textarea.

## Phase 4: Styling and Layout Refinements (Matching Screenshot)

- [x] **Task 4.4: Refine Overall Form Section Styling**
    *   **Objective:** Ensure the entire contact form section matches the screenshot's background color and padding.
    *   **File to Modify:** `src/components/sections/contact-form/contact-form.tsx`
    *   **Implementation Steps:**
        - [x] Apply background color (e.g., `bg-gray-100` or similar).
        - [x] Apply padding (e.g., `py-12 px-6 sm:py-16 sm:px-8`).
        - [x] Apply rounded corners if the section container has them (e.g., `rounded-lg`).
        - [x] Ensure `max-w-` and `mx-auto` are used appropriately for centering.

## Phase 5: Final Touches and Testing

- [x] **Task 5.1: Add `required` Attributes to Form Fields**
    *   **Objective:** Mark essential fields as required for basic client-side validation.
    *   **File to Modify:** `src/components/sections/contact-form/contact-form.tsx`
    *   **Implementation Steps:**
        - [x] Add the `required` attribute to the Name input.
        - [x] Add the `required` attribute to the Email input.
        - [x] Add the `required` attribute to the Message textarea.
        - (Telephone can be optional or required based on preference).

- [ ] **Task 5.2: (User Task) Test Form Submission with Getform.io**
    *   **Objective:** User verifies that form submissions are correctly received in their Getform.io dashboard.
    *   **Action:** User fills out and submits the form on the live/dev site and checks Getform.io.

- [x] **Task 5.3: Review Responsiveness**
    *   **Objective:** Ensure the contact form section displays correctly on various screen sizes (mobile, tablet, desktop).
    *   **Implementation Steps:**
        - [x] Test the layout on different viewport widths.
        - [x] The form is usable and readable on small screens.