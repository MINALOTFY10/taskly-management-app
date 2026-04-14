import { createClient } from "@/lib/supabase/client"

export async function signUpUser(values: {
  email: string
  password: string
  name: string
  jobTitle?: string | null
}) {
  const supabase = createClient()

  const { data, error } = await supabase.auth.signUp({
    email: values.email,
    password: values.password,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback?next=/main`,
      data: {
        name: values.name,
        job_title: values.jobTitle || null,
      },
    },
  })

  return { data, error }
}

export async function loginUser(values: { email: string; password: string }) {
  const supabase = createClient()
  const { data, error } = await supabase.auth.signInWithPassword({
    email: values.email,
    password: values.password,
  })

  return { data, error }
}
