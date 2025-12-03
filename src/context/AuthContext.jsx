import { createContext, useContext, useState, useEffect } from "react";
import { authAPI, setAuthToken, getAuthToken } from "../services/api";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const logout = () => {
    setAuthToken(null);
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  // Load user from localStorage on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = getAuthToken();
      const savedUser = localStorage.getItem("user");

      if (token && savedUser) {
        try {
          setUser(JSON.parse(savedUser));
          setIsAuthenticated(true);

          // Verify token is still valid
          const response = await authAPI.getMe();
          if (response.success) {
            setUser(response.data);
            localStorage.setItem("user", JSON.stringify(response.data));
          }
        } catch (error) {
          console.error("Token validation failed:", error);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authAPI.login({ email, password });

      if (response.success) {
        const { token, user: userData } = response.data;
        setAuthToken(token);
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem("user", JSON.stringify(userData));
        return { success: true, user: userData };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const register = async (data) => {
    try {
      const response = await authAPI.register(data);

      if (response.success) {
        const { token, userId, role } = response.data;
        setAuthToken(token);
        const newUser = {
          id: userId,
          role,
          email: data.email,
          name: data.name,
        };
        setUser(newUser);
        setIsAuthenticated(true);
        localStorage.setItem("user", JSON.stringify(newUser));
        return { success: true, user: newUser };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
