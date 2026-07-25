"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import { apiService } from "@/services/api"
interface User {
  id: string
  email: string
  name: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string,confirmPassword: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
  updateUser: (user: User) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
  const storedToken =
    typeof window !== "undefined"
      ? sessionStorage.getItem("token")
      : null;

  const storedUser =
    typeof window !== "undefined"
      ? sessionStorage.getItem("user")
      : null;

  console.log("Stored Token:", storedToken);
  console.log("Stored User:", storedUser);

  if (storedToken && storedUser) {
    const user = JSON.parse(storedUser);

    setToken(storedToken);
    setUser(user);

    apiService.setToken(storedToken);
  }

  setIsLoading(false);
}, []);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true)
    try {
    const response = await apiService.login(email, password);

    const token = response.token;
    const user = response.data.user;

    setUser(user);
    setToken(token);

    apiService.setToken(token);

    sessionStorage.setItem("token", token);
    sessionStorage.setItem("user", JSON.stringify(user));

  }  finally {
      setIsLoading(false)
    }
  }, [])

  const signup = useCallback(
  async (name: string, email: string, password: string,confirmPassword: string) => {
   
    setIsLoading(true);

    try {
       console.log("Signup function called");
      const response = await apiService.signup({
        name,
        email,
        password,
        passwordConfirm: confirmPassword,
      });
      console.log("After apiService.signup");
      const token = response.token;
      const user = response.data.user;

      setUser(user);
      setToken(token);

      apiService.setToken(token);

      sessionStorage.setItem("token", token);
      sessionStorage.setItem("user", JSON.stringify(user));
    } finally {
      setIsLoading(false);
    }
  },
  []
);

const updateUser = useCallback((user: User) => {
  setUser(user);

  sessionStorage.setItem("user", JSON.stringify(user));
}, []);

  const logout = useCallback(() => {
    setUser(null)
    setToken(null)
    sessionStorage.removeItem("token")
    sessionStorage.removeItem("user")
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        signup,
        logout,
        updateUser,
        isAuthenticated: !!user && !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
