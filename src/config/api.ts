// API configuration
const API_CONFIG = {
  baseUrl: process.env.API_BACKEND_URL || "http://localhost:8000",
  endpoints: {
    login: "/auth/login",
    signup: "/auth/signup",
    emailverify: "/auth/verify-email",
    phoneverify: "/auth/verify-phone",
    resendEmailVerification: "/auth/resend-email-verification",
    resendPhoneVerification: "/auth/resend-otp",
    createCompany: "/companies/create",
    getCompanies: "/companies",
    getCompaniesWithUserInfo: "/companies/with-user-info",
    getCompany: "/companies", // Append /{id} to get specific company
    updateCompany: "/companies", // Append /{id} to update specific company
    deleteCompany: "/companies", // Append /{id} to delete specific company
    suspendCompany: "/companies", // Append /{id}/suspend to suspend/unsuspend company
    // Social login endpoints
    socialLoginRequest: "/social-auth/request",
    socialSignin: "/social-auth/signin",
    registerSocialUser: "/social-auth/register-social-user",
    azureConfig: "/social-auth/azure-config",

    // Permissions endpoints
    getUserPermissions: "/permissions/user",
    getCompanyPermission: "/permissions/company", // Append /{company_id} to get specific company permission
    assignPermission: "/permissions/assign",
    updatePermission: "/permissions", // Append /{permission_id} to update specific permission
    deletePermission: "/permissions", // Append /{permission_id} to delete specific permission
    revokeCompanyPermissions: "/permissions/revoke/company", // Append /{company_id} to revoke all permissions for a company
    updateCompanyPermissions: "/permissions/update/company", // Append /{company_id} to update all permissions for a company

    // Account deletion endpoints
    requestAccountDeletion: "/auth/request-account-deletion",
    confirmAccountDeletion: "/auth/confirm-account-deletion",
  },
};

export default API_CONFIG;
