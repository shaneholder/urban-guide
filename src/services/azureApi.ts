import { AuthenticationResult } from "@azure/msal-browser";

export const fetchAzureResources = async (authResult: AuthenticationResult) => {
  const response = await fetch('/api/resources', {
    headers: {
      'Authorization': `Bearer ${authResult.accessToken}`
    }
  });
  return response.json();
};
