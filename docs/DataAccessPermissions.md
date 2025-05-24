# Data Access Permissions Documentation

This document outlines the data access permissions functionality in the Privacy Pseudo application, including the API endpoints, frontend implementation, and the user flow.

## Table of Contents

1. [Overview](#overview)
2. [API Endpoints](#api-endpoints)
3. [Frontend Implementation](#frontend-implementation)
4. [User Flow](#user-flow)
5. [Security Considerations](#security-considerations)
6. [Testing](#testing)

## Overview

The data access permissions feature allows users to control which companies can access their personal data. Users can:

1. Assign permissions to companies to access specific data fields (email, ID number, phone number)
2. View all companies that have been granted access to their data
3. Edit existing permissions for a company
4. Revoke all permissions for a company

This functionality ensures that users have complete control over their personal information and can manage which companies have access to what data.

## API Endpoints

### Assign Permissions

This endpoint allows users to grant a company access to specific data fields.

- **Endpoint**: `/permissions/assign`
- **Method**: POST
- **Authentication**: Bearer token required
- **Request Body**:
  ```json
  {
    "company_id": number,       // ID of the company to grant permissions to
    "email_allowed": boolean,   // Whether to allow access to email
    "id_number_allowed": boolean, // Whether to allow access to ID number
    "phone_number_allowed": boolean // Whether to allow access to phone number
  }
  ```
- **Response**:
  - Success (200 OK):
    ```json
    {
      "id": number,
      "user_id": number,
      "company_id": number,
      "email_allowed": boolean,
      "id_number_allowed": boolean,
      "phone_number_allowed": boolean,
      "created_at": string,
      "updated_at": string
    }
    ```
  - Error (400 Bad Request):
    ```json
    {
      "detail": "Invalid company ID"
    }
    ```
  - Error (401 Unauthorized):
    ```json
    {
      "detail": "Not authenticated"
    }
    ```

### Get User Permissions

This endpoint retrieves all companies that have been granted access to the user's data.

- **Endpoint**: `/permissions/user`
- **Method**: GET
- **Authentication**: Bearer token required
- **Response**:
  - Success (200 OK):
    ```json
    [
      {
        "id": number,
        "user_id": number,
        "company_id": number,
        "email_allowed": boolean,
        "id_number_allowed": boolean,
        "phone_number_allowed": boolean,
        "created_at": string,
        "updated_at": string,
        "company_name": string,
        "company_id_str": string
      }
    ]
    ```
  - Error (401 Unauthorized):
    ```json
    {
      "detail": "Not authenticated"
    }
    ```

### Update Permission

This endpoint updates existing permissions for a company.

- **Endpoint**: `/permissions/{permission_id}`
- **Method**: PUT
- **Authentication**: Bearer token required
- **Request Body**:
  ```json
  {
    "email_allowed": boolean,
    "id_number_allowed": boolean,
    "phone_number_allowed": boolean
  }
  ```
- **Response**:
  - Success (200 OK):
    ```json
    {
      "id": number,
      "user_id": number,
      "company_id": number,
      "email_allowed": boolean,
      "id_number_allowed": boolean,
      "phone_number_allowed": boolean,
      "created_at": string,
      "updated_at": string
    }
    ```
  - Error (404 Not Found):
    ```json
    {
      "detail": "Permission not found"
    }
    ```
  - Error (401 Unauthorized):
    ```json
    {
      "detail": "Not authenticated"
    }
    ```

### Revoke Company Permissions

This endpoint revokes all permissions for a specific company.

- **Endpoint**: `/permissions/revoke/company/{company_id}`
- **Method**: DELETE
- **Authentication**: Bearer token required
- **Response**:
  - Success (204 No Content): No response body
  - Error (404 Not Found):
    ```json
    {
      "detail": "Company not found or no permissions exist"
    }
    ```
  - Error (401 Unauthorized):
    ```json
    {
      "detail": "Not authenticated"
    }
    ```

## Frontend Implementation

The data access permissions functionality is implemented in two main components:

### AssignDataAccessPermissions.tsx

This component allows users to assign permissions to companies. It is located at `src/components/DataAccess/AssignDataAccessPermissions.tsx`.

#### Component Features

- Fetches a list of all available companies
- Allows users to select a company from a dropdown
- Provides checkboxes to select which data fields to allow access to
- Submits the permissions to the API
- Displays success or error messages

#### State Management

The component manages several states:

- `companies`: List of all available companies
- `selectedCompany`: The currently selected company
- `emailAllowed`, `idNumberAllowed`, `phoneNumberAllowed`: Boolean states for each permission type
- `loading`: Tracks loading state during API calls
- `submitting`: Tracks submission state during API calls
- `error`: Stores error messages
- `successMessage`: Stores success messages

### AllowedCompanies.tsx

This component displays all companies that have been granted access to the user's data and allows for editing or revoking permissions. It is located at `src/components/DataAccess/AllowedCompanies.tsx`.

#### Component Features

- Fetches a list of all companies with permissions
- Displays company information and granted permissions in a table
- Provides buttons to edit or revoke permissions
- Displays success or error messages

#### State Management

The component manages several states:

- `items`: List of companies with permissions
- `editingItems`: Boolean to track if editing mode is active
- `editingCompany`: The company being edited
- `loading`: Tracks loading state during API calls
- `revoking`: Tracks revoking state during API calls
- `error`: Stores error messages
- `successMessage`: Stores success messages

## User Flow

### Assigning Permissions

1. User navigates to "Data Access Management" > "Assign Data Access Permissions" in the sidebar
2. User selects a company from the dropdown
3. User checks the boxes for the data fields they want to allow access to
4. User clicks "Assign Permissions"
5. System sends the permissions to the API
6. System displays a success message if the permissions were assigned successfully

### Viewing and Managing Permissions

1. User navigates to "Data Access Management" > "Allowed Companies" in the sidebar
2. System displays a table of all companies with permissions
3. User can see which data fields each company has access to
4. User can click "Edit" to modify permissions
5. User can click "Revoke Access" to revoke all permissions for a company

### Editing Permissions

1. User clicks "Edit" for a company in the "Allowed Companies" view
2. System displays a modal with checkboxes for each data field
3. User modifies the permissions
4. User clicks "Save"
5. System sends the updated permissions to the API
6. System refreshes the table to show the updated permissions

### Revoking Permissions

1. User clicks "Revoke Access" for a company in the "Allowed Companies" view
2. System sends a request to the API to revoke all permissions for the company
3. System removes the company from the table

## Security Considerations

1. **Authentication**:

   - All API endpoints require a valid authentication token
   - Token is included in the Authorization header

2. **Authorization**:

   - Users can only manage permissions for their own data
   - Backend validates that the user owns the permissions being modified

3. **Data Validation**:

   - Frontend validates inputs before sending to the API
   - Backend validates all inputs to prevent malicious data

4. **Error Handling**:
   - Detailed error messages are displayed to the user
   - API errors are properly handled and displayed

## Testing

To test the data access permissions functionality:

1. Log in to the application
2. Navigate to "Data Access Management" > "Assign Data Access Permissions"
3. Select a company and assign permissions
4. Navigate to "Data Access Management" > "Allowed Companies"
5. Verify that the company appears in the table with the correct permissions
6. Test editing permissions
7. Test revoking permissions

### Test Cases

1. **Assign Permissions**:

   - Select a company and assign all permissions
   - Verify that the company appears in the "Allowed Companies" view
   - Verify that all permissions are correctly displayed

2. **Assign Partial Permissions**:

   - Select a company and assign only some permissions
   - Verify that only the selected permissions are displayed

3. **Edit Permissions**:

   - Edit an existing permission to add or remove access to a data field
   - Verify that the changes are reflected in the table

4. **Revoke Permissions**:

   - Revoke all permissions for a company
   - Verify that the company is removed from the table

5. **Error Handling**:
   - Attempt to assign permissions without selecting a company
   - Attempt to assign permissions without selecting any data fields
   - Verify that appropriate error messages are displayed
