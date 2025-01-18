import React, { createContext, useState, useEffect } from 'react';
import keycloak from '../services/Keycloak';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    let isMounted = true; // for unmounted shits
    if (!keycloak.authenticated) {
      keycloak
        .init({ onLoad: 'login-required' })
        .then((authenticated) => {
          if (isMounted) {
            setIsAuthenticated(authenticated);
            if (authenticated) {
              keycloak.loadUserInfo().then((userInfo) => {
                if (isMounted) setUser(userInfo);
              });
            }
          }
        })
    }
    return () => {
      isMounted = false; // Cleanup shits
    };
  }, []); // Only once

  return (
    <AuthContext.Provider value={{ isAuthenticated, user }}>
      {children}
    </AuthContext.Provider>
  );
};
