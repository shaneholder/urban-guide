import React from 'react';
import { useMsal } from "@azure/msal-react";
import { loginRequest } from '../config/msal';

const LoginButton = () => {
  const { instance } = useMsal();

  const handleLogin = () => {
    instance.loginRedirect(loginRequest);
  };

  return (
    <button onClick={handleLogin}>
      Sign in with Azure
    </button>
  );
};

export default LoginButton;
