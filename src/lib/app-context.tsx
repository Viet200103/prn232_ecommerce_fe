'use client'

import {createContext, ReactNode, useContext, useEffect, useState} from "react";
import {ACCESS_TOKEN} from "@/lib/contants";
import {AuthenticatedUser, JwtPayload} from "@/lib/types/auth.type";
import {decodeToken} from "@/lib/utils";
import cartApi from "@/lib/api/cart.api";
import {Cart} from "@/lib/types/cart.type";

interface AppContextType {
  isAuthenticated: boolean;
  user: AuthenticatedUser | null;
  cartCount: number;
  setCartCount: (count: number) => void;
  saveToken: (token: string) => void;
  logout: () => void;
}

export const AppContext = createContext<AppContextType>({
  isAuthenticated: false,
  user: null,
  cartCount: 0,
  setCartCount: () => {},
  saveToken: () => {},
  logout: () => {},
});

export const AppProvider = ({ children } : { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<AuthenticatedUser | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    if (currentUser) {
      cartApi.getCart(currentUser.userId)
        .then((cart) => {
          setCartCount(cart?.totalItems ?? 0)
        })
    }
  }, [currentUser]);

  const logout = async () => {
    localStorage.removeItem(ACCESS_TOKEN)
    setIsAuthenticated(false);
    setCurrentUser(null)
  }

  const loadUser = (token: string | null) => {
    if (token != null) {
      const payload: JwtPayload = decodeToken(token)
      const user: AuthenticatedUser = {
        role: payload.role,
        userId: payload.nameid,
        email: payload.email,
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

  const updateCartCount = (count: number) => {
    setCartCount(count)
  }

  return(
    <AppContext.Provider value={{
      isAuthenticated: isAuthenticated,
      user: currentUser,
      cartCount: cartCount,
      setCartCount: updateCartCount,
      saveToken: saveToken,
      logout: logout
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useAppContext = ()  => useContext(AppContext);