import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import * as authService from '../api/authService';
import axiosInstance from '../api/axiosInstance';

export const AuthContext = createContext({
  user: null,
  token: null,
  initializing: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  refreshProfile: async () => {},
});

const setAxiosAuthHeader = (token) => {
  if (token) {
    axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`;
    return;
  }

  delete axiosInstance.defaults.headers.common.Authorization;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [initializing, setInitializing] = useState(true);

  const clearSession = useCallback(() => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setAxiosAuthHeader(null);
  }, []);

  const handleAuthSuccess = useCallback((payload) => {
    const nextToken = payload?.accessToken ?? payload?.token;
    const nextUser = payload?.user ?? null;

    if (nextToken) {
      localStorage.setItem('token', nextToken);
      setToken(nextToken);
      setAxiosAuthHeader(nextToken);
    }

    if (nextUser) {
      setUser(nextUser);
    }
  }, []);

  const loadProfile = useCallback(async () => {
    try {
      const profile = await authService.getProfile();
      const nextUser = profile?.user ?? profile ?? null;
      setUser(nextUser);
      return nextUser;
    } catch (error) {
      clearSession();
      throw error;
    }
  }, [clearSession]);

  const login = useCallback(
    async (credentials) => {
      const data = await authService.login(credentials);
      handleAuthSuccess(data);
      const profile = await loadProfile();
      return profile ?? data?.user ?? null;
    },
    [handleAuthSuccess, loadProfile],
  );

  const register = useCallback(
    async (payload) => {
      const data = await authService.register(payload);
      handleAuthSuccess(data);
      const profile = await loadProfile();
      return profile ?? data?.user ?? null;
    },
    [handleAuthSuccess, loadProfile],
  );

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (error) {
      // even if backend logout fails we still clear client state
      console.error('Logout error:', error);
    } finally {
      clearSession();
    }
  }, [clearSession]);

  useEffect(() => {
    setAxiosAuthHeader(token);
    const bootstrap = async () => {
      if (!token) {
        setInitializing(false);
        return;
      }

      try {
        await loadProfile();
      } catch (error) {
        // loadProfile already clears session on error
      } finally {
        setInitializing(false);
      }
    };

    bootstrap();
  }, [token, loadProfile]);

  const value = useMemo(
    () => ({
      user,
      token,
      initializing,
      isAuthenticated: Boolean(token),
      login,
      register,
      logout,
      refreshProfile: loadProfile,
    }),
    [user, token, initializing, login, register, logout, loadProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
