'use client'

import {createContext, ReactNode, useContext, useEffect, useState} from "react";
import {ACCESS_TOKEN} from "@/lib/contants";

interface AppContextType {
  isAuthenticated: boolean;
  logout: () => void;
}

export const AppContext = createContext<AppContextType>({
  isAuthenticated: false,
  logout: () => {},
});


export const AppProvider = ({ children } : { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<AuthenticatedUser | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const logout = async () => {
    localStorage.removeItem(ACCESS_TOKEN)
    setIsAuthenticated(false);
  }

  useEffect(() => {
    const token = localStorage.getItem(ACCESS_TOKEN)
    setIsAuthenticated(!!token)
  }, []);

  return(
    <AppContext.Provider value={{
      isAuthenticated: isAuthenticated,
      logout: logout
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useAppContext = ()  => useContext(AppContext);