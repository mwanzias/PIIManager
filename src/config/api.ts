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
    // Social login endpoints
    socialLoginRequest: "/social-auth/request",
    socialSignin: "/social-auth/signin",
    azureConfig: "/social-auth/azure-config",
  },
};

export default API_CONFIG;
