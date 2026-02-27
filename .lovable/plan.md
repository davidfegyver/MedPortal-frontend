

# Remove Authentication Requirement

The app currently requires doctors to sign in before accessing any page. This plan removes all auth checks and the auth page, so the app is immediately usable without login.

## Changes

### 1. Update Index page (`src/pages/Index.tsx`)
- Remove the auth session check and redirect logic
- Remove the `useEffect` that checks for session
- Remove the logout button and its handler
- Remove `loading` state (no longer needed)
- Keep everything else (header, TAJ input, DoctorProfile)

### 2. Update DoctorProfile component (`src/components/DoctorProfile.tsx`)
- Remove the `supabase.auth.getUser()` call
- Display a static doctor name/icon instead of fetching from profiles table

### 3. Update PatientDetails page (`src/pages/PatientDetails.tsx`)
- Remove the session check and `/auth` redirect at line 26-27
- Keep the patient data fetching logic

### 4. Update PersonalData page (`src/pages/PersonalData.tsx`)
- Remove the session check and `/auth` redirect at line 26-27

### 5. Update PatientPDFs page (`src/pages/PatientPDFs.tsx`)
- Remove the session check and `/auth` redirect at line 22-23

### 6. Update App.tsx routing
- Remove the `/auth` route
- Remove the Auth page import

### 7. Database: Disable RLS or add public policies
- The tables currently have RLS enabled. Since there's no authentication, we need to add policies that allow public read access (using the anon key) so queries don't silently return empty results.
- Add `SELECT` policies for `patients`, `medical_records`, and `patient_pdfs` tables allowing all reads.

## Technical Notes
- The Auth page (`src/pages/Auth.tsx`) will no longer be routed to but can remain in the codebase (or be deleted for cleanliness).
- The edge function (`patient-ai`) uses the anon key for authorization, so it will continue to work without user auth.

