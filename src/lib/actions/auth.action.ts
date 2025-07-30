'use server'

export async function login(email: string, password: string): Promise<LoginResponse> {

  const baseUrl = process.env.NEXT_PUBLIC_SSHOP_BASE_URL;

  const data = {
    email: email,
    password: password
  }

  const response = await fetch(`${baseUrl}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Login failed')
  }

  return await response.json()

}

export async function register(email: string, password: string): Promise<RegisterResponse> {
  const baseUrl = process.env.NEXT_PUBLIC_SSHOP_BASE_URL

  const response = await fetch(`${baseUrl}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, role: "Customer"}),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Register failed')
  }

  return await response.json()
}