"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { AlertCircle, CheckCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { getSupabaseBrowser } from "@/lib/supabase-browser"

export default function CreateAdminPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = getSupabaseBrowser()

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas")
      setLoading(false)
      return
    }

    try {
      // Create user with Supabase
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/admin`,
        },
      })

      if (error) {
        console.error("Error creating admin:", error)
        setError(error.message)
        return
      }

      if (data.user) {
        setSuccess("Compte administrateur créé avec succès! Veuillez vérifier votre email pour confirmer votre compte.")

        // In development, we can auto-confirm the user
        if (process.env.NODE_ENV === "development") {
          try {
            // This is a workaround for development - in production, users should confirm via email
            await fetch("/api/confirm-user", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ userId: data.user.id }),
            })
            setSuccess("Compte administrateur créé et confirmé avec succès! Vous pouvez maintenant vous connecter.")
          } catch (err) {
            console.error("Error auto-confirming user:", err)
          }
        }
      }
    } catch (err: any) {
      console.error("Unexpected error during admin creation:", err)
      setError(`Une erreur s'est produite: ${err.message || "Unknown error"}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-md">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Créer un compte administrateur</h1>
        <p className="text-gray-600">Créez un compte pour gérer les véhicules</p>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mb-6 bg-green-50 border-green-200 text-green-800">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleCreateAdmin} className="space-y-6">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="mt-1"
              />
            </div>

            <Button className="w-full bg-red-600 hover:bg-red-700" type="submit" disabled={loading || !!success}>
              {loading ? "Création en cours..." : "Créer un compte administrateur"}
            </Button>
          </form>
        </div>
      </div>

      <div className="mt-6 text-center">
        <p className="text-gray-600">
          Déjà un compte?{" "}
          <Link href="/admin/login" className="text-red-600 hover:text-red-800">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  )
}
