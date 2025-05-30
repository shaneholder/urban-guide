import { useCallback } from 'react';
import { useMsal } from "@azure/msal-react";
import { loginRequest } from '../config/msal';
import { AuthError } from '../services/azureApi';

export const useAuth = () => {
  const { instance } = useMsal();

  const handleAuthError = useCallback(async (error) => {
    if (error instanceof AuthError && error.message === 'TOKEN_EXPIRED') {
      await instance.logoutRedirect();
      await instance.loginRedirect(loginRequest);
    }
  }, [instance]);

  return {
    handleAuthError
  };
};
