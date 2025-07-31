import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import {JwtPayload, RawJwtPayload} from "@/lib/types/auth.type";
import { jwtDecode } from 'jwt-decode'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function decodeToken(token: string): JwtPayload {
  const raw = jwtDecode<RawJwtPayload>(token)
  return {
    email: raw["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"],
    role: raw["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"],
    exp: raw.exp,
    iss: raw.iss,
    aud: raw.aud,
  }
}
