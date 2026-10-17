import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { createSupabaseClient } from '../sync/supabase'

type AuthContextValue = {
  available: boolean
  loading: boolean
  session: Session | null
  user: User | null
  error: string | null
  signIn: (identifier: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function SupabaseAuthProvider({ children }: { children: ReactNode }) {
  const client = useMemo(() => createSupabaseClient(), [])
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(Boolean(client))
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!client) {
      setLoading(false)
      return undefined
    }
    let active = true
    void client.auth.getSession().then(({ data, error: sessionError }) => {
      if (!active) return
      setSession(data.session)
      if (sessionError) setError(sessionError.message)
      setLoading(false)
    })
    const { data: subscription } = client.auth.onAuthStateChange((_event, nextSession) => {
      if (!active) return
      setSession(nextSession)
      setLoading(false)
    })
    return () => {
      active = false
      subscription.subscription.unsubscribe()
    }
  }, [client])

  const value = useMemo<AuthContextValue>(() => ({
    available: Boolean(client),
    loading,
    session,
    user: session?.user ?? null,
    error,
    async signIn(identifier, password) {
      if (!client) throw new Error('Supabase não configurado')
      setError(null)
      try {
        const { data: clientProfile, error: profileError } = await client
          .from('clients')
          .select('email,user_name')
          .or(`email.eq."${identifier}",user_name.eq."${identifier}"`)
          .maybeSingle()
        if (profileError || !clientProfile?.email) throw new Error(profileError?.message ?? 'Usuário não encontrado')
        const { error: signInError } = await client.auth.signInWithPassword({ email: clientProfile.email, password })
        if (signInError) throw new Error(signInError.message)
      } catch (signInError) {
        const message = signInError instanceof Error ? signInError.message : 'Falha na autenticação'
        setError(message)
        throw signInError
      }
    },
    async signOut() {
      if (!client) return
      const { error: signOutError } = await client.auth.signOut()
      if (signOutError) throw new Error(signOutError.message)
    },
  }), [client, error, loading, session])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useSupabaseAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useSupabaseAuth must be used inside SupabaseAuthProvider')
  return context
}
