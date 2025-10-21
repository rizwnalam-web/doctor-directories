# Doctor Registration - Complete Field List

## Overview
The doctor registration form now includes all relevant fields that are saved to the database.

## Fields Implemented

### Basic User Information (All Users)
- **First Name** - Required
- **Last Name** - Required
- **Email** - Required, unique
- **Phone** - Optional
- **Password** - Required, minimum 6 characters
- **Role** - Required (PATIENT or DOCTOR)

### Doctor-Specific Information (Only for DOCTOR role)

#### Professional Details
- **Medical License Number** - Optional (auto-generated if not provided)
- **Bio / About** - Optional text area for doctor's description and specialization
- **Years of Experience** - Optional number field
- **Consultation Fee** - Optional decimal field (in USD)

#### Location Information
- **Clinic/Hospital Address** - Optional street address
- **City** - Optional
- **State** - Optional
- **Zip Code** - Optional

## Database Tables

### User Table
All basic user information is stored in the `users` table:
- id, email, password, firstName, lastName, phone, role, avatar, isActive, createdAt, updatedAt

### Doctor Table
Doctor-specific information is stored in the `doctors` table:
- id, userId, status, licenseNumber, bio, yearsOfExperience, consultationFee
- address, city, state, zipCode, latitude, longitude

### Related Tables (Can be added later via profile update)
- **doctor_specializations** - Links doctors to their specializations
- **educations** - Doctor's educational background
- **experiences** - Doctor's work experience
- **availabilities** - Doctor's availability schedule

## Registration Flow

1. User fills out the registration form
2. If role is DOCTOR, additional fields appear
3. On submit, data is sent to `/api/auth/register`
4. Backend creates:
   - User record in `users` table
   - Doctor record in `doctors` table (if role is DOCTOR)
   - Patient record in `patients` table (if role is PATIENT)
5. Doctor status is set to 'PENDING' by default
6. Admin must verify doctor before they appear in search results

## Status Values

Doctor accounts have the following status values:
- **PENDING** - Newly registered, awaiting verification
- **VERIFIED** - Approved by admin, visible in search
- **REJECTED** - Not approved
- **SUSPENDED** - Temporarily disabled

## Testing

Use the provided `test-register.json` file to test the registration endpoint:

```bash
# Using the test file (create your own curl command or use Postman)
POST http://localhost:5000/api/auth/register
Content-Type: application/json
Body: Contents of test-register.json
```

## Next Steps

After registration, doctors can:
1. Wait for admin verification
2. Complete their profile with:
   - Specializations
   - Education history
   - Work experience
   - Availability schedule
3. Once verified, they will appear in doctor search results
