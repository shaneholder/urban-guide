import React from 'react';
import { useMsal } from "@azure/msal-react";
import { loginRequest } from '../config/msal';
import styles from './LoginButton.module.css';

const LoginButton = () => {
  const { instance } = useMsal();

  const handleLogin = () => {
    instance.loginRedirect(loginRequest);
  };

  return (
    <div className={styles.container}>
      <button className={styles.loginButton} onClick={handleLogin}>
        Sign in with Azure
      </button>
    </div>
  );
};

export default LoginButton;
