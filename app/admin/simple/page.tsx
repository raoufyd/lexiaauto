"use client"

import { useEffect, useState } from "react"
import { getSupabaseBrowser } from "@/lib/supabase-browser"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function SimpleAdminPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = getSupabaseBrowser()

  useEffect(() => {
    async function getUser() {
      try {
        const { data, error } = await supabase.auth.getUser()

        if (error) {
          throw error
        }

        setUser(data.user)
      } catch (err: any) {
        console.error("Error getting user:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    getUser()
  }, [supabase])

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      window.location.href = "/admin/login"
    } catch (err: any) {
      console.error("Error signing out:", err)
      setError(err.message)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Simple Admin Page</h1>
        <p>Loading...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Simple Admin Page</h1>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p>Error: {error}</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Simple Admin Page</h1>
        <p>
          Not authenticated. Please{" "}
          <Link href="/admin/login" className="text-red-600 hover:underline">
            login
          </Link>
          .
        </p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Simple Admin Page</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">User Information</h2>
        <div className="space-y-2">
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>ID:</strong> {user.id}
          </p>
          <p>
            <strong>Last Sign In:</strong> {new Date(user.last_sign_in_at).toLocaleString()}
          </p>
        </div>

        <div className="mt-6">
          <Button onClick={handleSignOut} variant="destructive">
            Sign Out
          </Button>
        </div>
      </div>

      <div className="flex space-x-4">
        <Button asChild>
          <Link href="/admin">Go to Main Admin</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/">Back to Home</Link>
        </Button>
      </div>
    </div>
  )
}
