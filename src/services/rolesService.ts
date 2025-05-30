import { AuthenticationResult } from "@azure/msal-browser";

export interface AzureRole {
  id: string;
  roleName: string;
  description: string;
  type: string;
}

export const fetchAzureRoles = async (authToken: AuthenticationResult) => {
  const response = await fetch('/api/roles', {
    headers: {
      'Authorization': `Bearer ${authToken.accessToken}`
    }
  });
  return response.json();
};
