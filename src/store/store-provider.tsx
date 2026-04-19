"use client"

import { useRef, type ReactNode } from "react"
import { Provider } from "react-redux"
import type { User as SupabaseUser } from "@supabase/supabase-js"

import { makeStore, type AppStore } from "./store"

type StoreProviderProps = {
  initialUser?: SupabaseUser | null
  children: ReactNode
}

export function StoreProvider({ initialUser, children }: StoreProviderProps) {
  const storeRef = useRef<AppStore | null>(null)

  if (!storeRef.current) {
    storeRef.current = makeStore({
      user: {
        user: initialUser ?? null,
        status: initialUser ? "succeeded" : "idle",
        error: null,
        initialized: !!initialUser,
      },
    })
  }

  return <Provider store={storeRef.current}>{children}</Provider>
}