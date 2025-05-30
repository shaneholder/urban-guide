import { AuthenticationResult } from "@azure/msal-browser";

export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthError';
  }
}

const handleApiResponse = async (response: Response) => {
  if (response.status === 401) {
    const error = await response.json();
    if (error.code === 'TOKEN_EXPIRED') {
      throw new AuthError('TOKEN_EXPIRED');
    }
  }
  return response.json();
};

export const fetchAzureResources = async (authResult: AuthenticationResult) => {
  const response = await fetch('/api/resources', {
    headers: {
      'Authorization': `Bearer ${authResult.accessToken}`
    }
  });
  return handleApiResponse(response);
};

export const fetchAzureResourceGroups = async (authResult: AuthenticationResult, subscriptionId: string) => {
  const response = await fetch(`/api/subscriptions/${subscriptionId}/resourceGroups`, {
    headers: {
      'Authorization': `Bearer ${authResult.accessToken}`
    }
  });

  return handleApiResponse(response);
};

export interface AzureRole {
  id: string;
  roleName: string;
  description: string;
  type: 'BuiltInRole' | 'CustomRole';
}

export const fetchAzureRoles = async (authResult: AuthenticationResult) => {
  const response = await fetch('/api/roles', {
    headers: {
      'Authorization': `Bearer ${authResult.accessToken}`
    }
  });
  return response.json() as Promise<AzureRole[]>;
};
