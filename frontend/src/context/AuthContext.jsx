import { createContext, useContext, useEffect, useState } from "react";
import { loginRequest, meRequest, signupRequest } from "../services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("codeflow_token");

    if (!token) {
      setLoading(false);
      return;
    }

    meRequest()
      .then(({ user: currentUser }) => setUser(currentUser))
      .catch(() => localStorage.removeItem("codeflow_token"))
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

  const logout = () => {
    localStorage.removeItem("codeflow_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
