import {
  AccountInfo,
  AuthenticationResult,
  PublicClientApplication,
} from "@azure/msal-browser";
import { msalConfig, loginRequest } from "../config/msalConfig";
import axios from "axios";
import API_CONFIG from "../config/api";

// Initialize MSAL instance
export const msalInstance = new PublicClientApplication(msalConfig);

// Initialize the MSAL instance when the module is loaded
msalInstance.initialize().catch((error) => {
  console.error("Failed to initialize MSAL instance:", error);
});

// Function to get Azure AD configuration from backend
export const getAzureConfig = async () => {
  try {
    const response = await axios.get(
      `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.azureConfig}`,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching Azure config:", error);
    return null;
  }
};

// Function to handle login popup
export const handleMsalLogin = async () => {
  try {
    // Get Azure config from backend
    const azureConfig = await getAzureConfig();

    if (!azureConfig) {
      throw new Error("Failed to get Azure configuration");
    }

    // Create a new MSAL config with values from backend
    const updatedConfig = {
      ...msalConfig,
      auth: {
        ...msalConfig.auth,
        clientId: azureConfig.clientId,
        authority: azureConfig.authority,
        redirectUri: azureConfig.redirectUri, // Use redirectUri from backend
      },
    };

    // Create a new instance with the updated config
    const updatedMsalInstance = new PublicClientApplication(updatedConfig);

    // Initialize the MSAL instance before using it
    await updatedMsalInstance.initialize();

    // Create a login request with scopes from backend
    const customLoginRequest = {
      scopes: azureConfig.scopes,
    };

    // Login with popup
    const response = await updatedMsalInstance.loginPopup(customLoginRequest);

    // Get user info from Microsoft Graph
    const userInfo = await getUserInfoFromGraph(response);

    return {
      authResponse: response,
      userInfo,
    };
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
};

// Function to get user info from Microsoft Graph
export const getUserInfoFromGraph = async (
  authResponse: AuthenticationResult
) => {
  try {
    const accessToken = authResponse.accessToken;

    const response = await axios.get("https://graph.microsoft.com/v1.0/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error getting user info from Graph:", error);
    throw error;
  }
};

// Function to encrypt sensitive data
export const encryptData = async (data: any) => {
  // In a real app, you would use a proper encryption library
  // For now, we'll just use base64 encoding as a placeholder
  return btoa(JSON.stringify(data));
};

// Function to create a social login request and get request ID
export const createSocialLoginRequest = async () => {
  try {
    const response = await axios.post(
      `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.socialLoginRequest}`,
      {},
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );
    return response.data.request_id;
  } catch (error) {
    console.error("Error creating social login request:", error);
    throw error;
  }
};

// Function to submit social login data to backend
export const submitSocialLogin = async (
  provider: string,
  userData: any,
  requestId: string
) => {
  try {
    // Encrypt the user data
    const encryptedData = await encryptData(userData);

    // Submit to backend
    const response = await axios.post(
      `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.socialSignin}`,
      {
        provider_name: provider,
        response: encryptedData,
        request_id: requestId,
      },
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error submitting social login:", error);
    throw error;
  }
};

// Function to register a new social login user
export const registerSocialUser = async (
  email: string,
  idNumber: string,
  phoneNumber: string,
  provider: string
) => {
  try {
    // Submit to backend
    const response = await axios.post(
      `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.registerSocialUser}`,
      null,
      {
        params: {
          email,
          id_number: idNumber,
          phone_number: phoneNumber,
          provider,
        },
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error registering social user:", error);
    throw error;
  }
};

// Function to handle Microsoft logout
export const handleMsalLogout = async () => {
  try {
    // Get all accounts
    const accounts = msalInstance.getAllAccounts();

    if (accounts.length > 0) {
      // Logout from all accounts
      await msalInstance.logoutPopup({
        account: accounts[0],
        postLogoutRedirectUri: window.location.origin,
      });

      console.log("Successfully logged out from Microsoft");
    }
  } catch (error) {
    console.error("Error logging out from Microsoft:", error);
  }
};
