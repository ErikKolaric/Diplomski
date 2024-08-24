import { createContext, useContext, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  // Memoize the login function
  const login = useCallback(
    async (data) => {
      navigate("/");
    },
    [navigate]
  );

  // Memoize the logout function
  const logout = useCallback(() => {
    navigate("/", { replace: true });
  }, [navigate]);

  // Memoize the context value
  const value = useMemo(
    () => ({
      user,
      login,
      logout,
    }),
    [user, login, logout] // Dependencies for the value memoization
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
