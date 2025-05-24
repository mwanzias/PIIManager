# Account Deletion Documentation

This document outlines the account deletion functionality in the Privacy Pseudo application, including the API endpoints, frontend implementation, and the user flow.

## Table of Contents

1. [Overview](#overview)
2. [API Endpoints](#api-endpoints)
3. [Frontend Implementation](#frontend-implementation)
4. [User Flow](#user-flow)
5. [Security Considerations](#security-considerations)
6. [Testing](#testing)

## Overview

The account deletion feature allows users to permanently delete their accounts from the system. The process involves multiple verification steps to ensure security:

1. Email and phone number verification
2. Pseudo code verification
3. OTP verification via email or phone

Once all verifications are successful, the user's account is deleted from the system, including all associated data and permissions.

## API Endpoints

### Request Account Deletion

This endpoint initiates the account deletion process by verifying the user's pseudo code and sending an OTP to the user's preferred contact method.

- **Endpoint**: `/auth/request-account-deletion`
- **Method**: POST
- **Authentication**: Bearer token required
- **Request Body**:
  ```json
  {
    "phone_number_verify": boolean,  // true to send OTP to phone, false for email
    "pseudo_code": string            // User's pseudo code for verification
  }
  ```
- **Response**:
  - Success (200 OK):
    ```json
    {
      "message": "OTP sent to your registered email/phone. Use this OTP to confirm account deletion."
    }
    ```
  - Error (400 Bad Request):
    ```json
    {
      "detail": "Invalid pseudo code"
    }
    ```
  - Error (401 Unauthorized):
    ```json
    {
      "detail": "Not authenticated"
    }
    ```

### Confirm Account Deletion

This endpoint confirms the account deletion using the OTP received by the user.

- **Endpoint**: `/auth/confirm-account-deletion`
- **Method**: POST
- **Authentication**: Bearer token required
- **Request Body**:
  ```json
  {
    "otp": string  // OTP received by the user
  }
  ```
- **Response**:
  - Success (204 No Content): No response body
  - Error (400 Bad Request):
    ```json
    {
      "detail": "Invalid OTP"
    }
    ```
  - Error (401 Unauthorized):
    ```json
    {
      "detail": "Not authenticated"
    }
    ```

## Frontend Implementation

The account deletion functionality is implemented in the `DeleteAccount.tsx` component located at `src/components/AccountManagement/DeleteAccount.tsx`.

### Component Props

The component accepts the following props from the `accountManagementProps` interface:

```typescript
interface accountManagementProps {
  idnumber?: string; // The ID of the account
  emailAddress: string; // The email address of the account
  phoneNumber: number; // The phone number of the account
}
```

### State Management

The component manages several states:

- `accountMatch`: Tracks if the entered account details match
- `accountemail` and `accountphone`: For user input
- `verifiedOTP`: Tracks if OTP is verified
- `otpDestination`: Tracks preferred contact method (email or phone)
- `pseudoCode`: Stores the user's pseudo code input
- `otp`: Stores the OTP input
- `isLoading`: Tracks loading states during API calls
- `error`: Stores error messages
- `successMessage`: Stores success messages
- `accountDeleted`: Tracks if account is deleted
- `feedbackReceived` and `feedbackCancelled`: For feedback submission

### Key Functions

1. **handleNext**: Verifies the user's email and phone number match the account details.
2. **handleOTP**: Calls the request-account-deletion API to verify the pseudo code and request an OTP.
3. **handleDeleteAccount**: Calls the confirm-account-deletion API to verify the OTP and delete the account.
4. **handleExitFeedback** and **handleExitFeedbackCancelled**: Handle feedback submission after account deletion.

### API Integration

The component uses the API endpoints defined in `src/config/api.ts`:

```typescript
// Account deletion endpoints
requestAccountDeletion: "/auth/request-account-deletion",
confirmAccountDeletion: "/auth/confirm-account-deletion",
```

## User Flow

1. **Account Verification**:

   - User enters their email address and phone number
   - User selects preferred contact method (email or phone)
   - System verifies the entered details match the account

2. **Pseudo Code Verification**:

   - User enters their pseudo code
   - System verifies the pseudo code
   - System sends an OTP to the user's preferred contact method

3. **OTP Verification**:

   - User enters the OTP received
   - System verifies the OTP
   - System deletes the account if OTP is valid

4. **Feedback Collection**:
   - After successful deletion, user is prompted to provide feedback
   - User can submit feedback or cancel
   - User is signed out and redirected to the home page

## Security Considerations

1. **Multiple Verification Layers**:

   - Email and phone verification
   - Pseudo code verification
   - OTP verification

2. **Authentication**:

   - All API endpoints require a valid authentication token
   - Token is included in the Authorization header

3. **Error Handling**:

   - Detailed error messages are displayed to the user
   - API errors are properly handled and displayed

4. **Session Management**:
   - User is automatically signed out after successful account deletion
   - User is redirected to the home page

## Testing

To test the account deletion functionality:

1. Log in to the application
2. Navigate to the account management section
3. Select the account deletion option
4. Follow the verification steps:
   - Enter email and phone number
   - Enter pseudo code
   - Enter OTP
5. Verify the account is deleted by attempting to log in again

### Test Cases

1. **Valid Deletion**:

   - All verification steps pass
   - Account is successfully deleted

2. **Invalid Email/Phone**:

   - Entered email or phone doesn't match account
   - Error message is displayed

3. **Invalid Pseudo Code**:

   - Entered pseudo code is incorrect
   - Error message is displayed

4. **Invalid OTP**:

   - Entered OTP is incorrect
   - Error message is displayed

5. **Expired OTP**:
   - OTP has expired
   - Error message is displayed
