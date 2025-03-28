import { createContext, useState, useEffect, ReactNode } from "react";
import { User, InsertUser } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";

interface AuthContextProps {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (userData: Omit<InsertUser, 'password'> & { password: string }) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextProps>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Check if user is already authenticated
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const res = await fetch("/api/auth/status", {
          credentials: "include",
        });
        
        const data = await res.json();
        
        if (data.authenticated) {
          setUser(data.user);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const res = await apiRequest("POST", "/api/auth/login", {
        username,
        password,
      });
      
      const data = await res.json();
      setUser(data);
      setIsAuthenticated(true);
      
      // Invalidate relevant queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
      
      return data;
    } catch (error) {
      throw new Error("Error al iniciar sesión. Verifica tus credenciales.");
    }
  };

  const register = async (userData: Omit<InsertUser, 'password'> & { password: string }) => {
    try {
      const res = await apiRequest("POST", "/api/auth/register", userData);
      
      const data = await res.json();
      setUser(data);
      setIsAuthenticated(true);
      
      return data;
    } catch (error) {
      throw new Error("Error al registrar usuario. El email o nombre de usuario ya existe.");
    }
  };

  const logout = async () => {
    try {
      await apiRequest("POST", "/api/auth/logout", undefined);
      
      setUser(null);
      setIsAuthenticated(false);
      
      // Clear any user-specific cached data
      queryClient.invalidateQueries();
      
      toast({
        title: "Sesión cerrada",
        description: "Has cerrado sesión correctamente",
      });
    } catch (error) {
      console.error("Error logging out:", error);
      toast({
        title: "Error",
        description: "No se pudo cerrar sesión",
        variant: "destructive",
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
