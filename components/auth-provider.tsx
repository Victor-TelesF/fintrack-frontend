'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'

type AuthContextValue = {
  user: string | null
  ready: boolean
  signIn: (token: string, user: string) => void
  signOut: () => void
}
const AuthContext = createContext<AuthContextValue | null>(null)
const publicRoutes = ['/login', '/register']

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<string | null>(null)
  const [ready, setReady] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    queueMicrotask(() => {
      setUser(localStorage.getItem('fintrack_user'))
      setReady(true)
    })
  }, [])
  useEffect(() => {
    if (!ready) return
    const token = localStorage.getItem('fintrack_token')
    if (!token && !publicRoutes.includes(pathname)) router.replace('/login')
    if (token && publicRoutes.includes(pathname)) router.replace('/dashboard')
  }, [pathname, ready, router])

  useEffect(() => {
    const handleUnauthorized = () => {
      setUser(null)
      router.replace('/login')
    }
    window.addEventListener('fintrack:unauthorized', handleUnauthorized)
    return () =>
      window.removeEventListener('fintrack:unauthorized', handleUnauthorized)
  }, [router])

  const value = useMemo(
    () => ({
      user,
      ready,
      signIn: (token: string, name: string) => {
        localStorage.setItem('fintrack_token', token)
        localStorage.setItem('fintrack_user', name)
        setUser(name)
        router.replace('/dashboard')
      },
      signOut: () => {
        localStorage.removeItem('fintrack_token')
        localStorage.removeItem('fintrack_user')
        setUser(null)
        router.replace('/login')
      },
    }),
    [router, user, ready],
  )
  if (!ready)
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-sm text-muted-foreground">
        Carregando FinTrack...
      </div>
    )
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const value = useContext(AuthContext)
  if (!value) throw new Error('useAuth deve ser usado dentro de AuthProvider')
  return value
}
