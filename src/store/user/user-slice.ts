import type { User as SupabaseUser } from "@supabase/supabase-js"
import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

type UserStatus = "idle" | "loading" | "succeeded" | "failed"

type UserState = {
  user: SupabaseUser | null
  status: UserStatus
  error: string | null
  initialized: boolean
}

const initialState: UserState = {
  user: null,
  status: "idle",
  error: null,
  initialized: false,
}

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<SupabaseUser | null>) {
      state.user = action.payload
      state.status = "succeeded"
      state.error = null
      state.initialized = true
    },
    clearUser(state) {
      state.user = null
      state.status = "idle"
      state.error = null
      state.initialized = true
    },
  }
})

export const { setUser, clearUser } = userSlice.actions
export default userSlice.reducer