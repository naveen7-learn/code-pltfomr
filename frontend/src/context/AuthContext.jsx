import { createContext, useContext, useEffect, useState } from "react";
import { loginRequest, meRequest, signupRequest } from "../services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 🔍 Looking for your specific token key
    const token = localStorage.getItem("codeflow_token");

    if (!token) {
      setLoading(false);
      return;
    }

    meRequest()
      .then(({ user: currentUser }) => setUser(currentUser))
      .catch(() => {
        // If token is invalid or expired, wipe it
        localStorage.removeItem("codeflow_token");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const persistAuth = (payload) => {
    localStorage.setItem("codeflow_token", payload.token);
    setUser(payload.user);
  };

  const login = async (formData) => {
    const payload = await loginRequest(formData);
    persistAuth(payload);
    return payload.user;
  };

  const signup = async (formData) => {
    const payload = await signupRequest(formData);
    persistAuth(payload);
    return payload.user;
  };

  // 🚀 UPDATED LOGOUT FUNCTION
  const logout = () => {
    // 1. Wipe the specific auth token
    localStorage.removeItem("codeflow_token");
    
    // 2. Clear the React state
    setUser(null);
    
    // 3. HARD REDIRECT: This forces the browser to drop all 
    // active components and send you to the login screen.
    window.location.href = "/auth/login";
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);