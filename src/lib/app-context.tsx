'use client'

import {createContext, ReactNode, useContext, useEffect, useState} from "react";
import {ACCESS_TOKEN} from "@/lib/contants";
import {AuthenticatedUser, JwtPayload} from "@/lib/types/auth.type";
import {decodeToken} from "@/lib/utils";

interface AppContextType {
  isAuthenticated: boolean;
  user: AuthenticatedUser | null;
  saveToken: (token: string) => void;
  logout: () => void;
}

export const AppContext = createContext<AppContextType>({
  isAuthenticated: false,
  user: null,
  saveToken: () => {},
  logout: () => {},
});


export const AppProvider = ({ children } : { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<AuthenticatedUser | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const logout = async () => {
    localStorage.removeItem(ACCESS_TOKEN)
    setIsAuthenticated(false);
    setCurrentUser(null)
    console.log("aaaaaaaaaaaaaaaaaaaaaaa")
  }

  const loadUser = (token: string | null) => {
    if (token != null) {
      const payload: JwtPayload = decodeToken(token)
      const user: AuthenticatedUser = {
        role: payload.role
      }
      setCurrentUser(user)
    }
  }
  useEffect(() => {
    const token = localStorage.getItem(ACCESS_TOKEN)
    loadUser(token)
    setIsAuthenticated(!!token)
  }, []);

  const saveToken = (token: string) => {
    localStorage.setItem(ACCESS_TOKEN, token);
    loadUser(token)
    setIsAuthenticated(true)
  }

  return(
    <AppContext.Provider value={{
      isAuthenticated: isAuthenticated,
      user: currentUser,
      saveToken: saveToken,
      logout: logout
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useAppContext = ()  => useContext(AppContext);