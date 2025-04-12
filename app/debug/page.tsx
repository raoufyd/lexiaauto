import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export default async function DebugPage() {
  // Check if environment variables are set
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Try to initialize Supabase client
  let supabaseStatus = "Not initialized"
  let error = null

  try {
    const supabase = createServerComponentClient({ cookies })
    const { data, error: supabaseError } = await supabase.from("cars").select("count").single()

    if (supabaseError) {
      supabaseStatus = "Error"
      error = supabaseError.message
    } else {
      supabaseStatus = "Connected"
    }
  } catch (e: any) {
    supabaseStatus = "Exception"
    error = e.message
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Debug Information</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Environment Variables</h2>
        <div className="space-y-2">
          <div>
            <span className="font-medium">NEXT_PUBLIC_SUPABASE_URL:</span>{" "}
            {supabaseUrl ? (
              <span className="text-green-600">Set ✓</span>
            ) : (
              <span className="text-red-600">Not set ✗</span>
            )}
          </div>
          <div>
            <span className="font-medium">NEXT_PUBLIC_SUPABASE_ANON_KEY:</span>{" "}
            {supabaseAnonKey ? (
              <span className="text-green-600">Set ✓</span>
            ) : (
              <span className="text-red-600">Not set ✗</span>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Supabase Connection</h2>
        <div className="space-y-2">
          <div>
            <span className="font-medium">Status:</span>{" "}
            {supabaseStatus === "Connected" ? (
              <span className="text-green-600">Connected ✓</span>
            ) : (
              <span className="text-red-600">{supabaseStatus} ✗</span>
            )}
          </div>
          {error && (
            <div>
              <span className="font-medium">Error:</span> <span className="text-red-600">{error}</span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8">
        <p className="text-gray-600">If you're seeing issues with the Supabase connection, please check:</p>
        <ul className="list-disc list-inside mt-2 text-gray-600">
          <li>Your environment variables are correctly set in your Vercel project</li>
          <li>Your Supabase project is running and accessible</li>
          <li>Your database tables are correctly set up</li>
          <li>Your Supabase project's API settings allow requests from your domain</li>
        </ul>
      </div>
    </div>
  )
}
