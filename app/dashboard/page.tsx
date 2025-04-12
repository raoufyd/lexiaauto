import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import type { Database } from "@/lib/database.types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import CarDashboard from "@/components/car-dashboard"

export default async function DashboardPage() {
  // Initialize Supabase client
  const supabase = createServerComponentClient<Database>({ cookies })

  // Test the connection
  const { data, error } = await supabase.from("cars").select("count").single()

  const connectionStatus = error ? "error" : "connected"

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Tableau de bord Supabase</h1>

      <div className="grid gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Statut de la connexion</CardTitle>
            <CardDescription>Vérification de la connexion à Supabase</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div
                className={`w-3 h-3 rounded-full mr-2 ${
                  connectionStatus === "connected" ? "bg-green-500" : "bg-red-500"
                }`}
              />
              <span>{connectionStatus === "connected" ? "Connecté à Supabase" : "Erreur de connexion à Supabase"}</span>
            </div>

            {connectionStatus === "error" && (
              <div className="mt-4 text-sm text-red-600">
                <p>Erreur: {error?.message || "Erreur inconnue"}</p>
                <p className="mt-2">
                  Vérifiez vos variables d'environnement NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY.
                </p>
              </div>
            )}

            {connectionStatus === "connected" && (
              <div className="mt-4 text-sm text-green-600">
                <p>Connexion établie avec succès!</p>
                <p className="mt-1">URL: {process.env.NEXT_PUBLIC_SUPABASE_URL}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <CarDashboard />
      </div>
    </div>
  )
}
