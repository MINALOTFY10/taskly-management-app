import { createClient } from "@/lib/supabase/client"

export default async function Page() {
  const supabase = createClient()
  const { data, error } = await supabase.from("projects").select("count")

  console.log("Supabase connection test:", { data, error })

  return (
    <div className="p-8">
      {error ? (
        <p className="text-red-500">Connection failed: {error.message}</p>
      ) : (
        <p className="text-green-600">Supabase connected successfully</p>
      )}
    </div>
  )
}