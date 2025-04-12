"use client"

import { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/lib/database.types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import Link from "next/link"

export default function CarDashboard() {
  const [cars, setCars] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClientComponentClient<Database>()

  useEffect(() => {
    async function fetchCars() {
      try {
        setLoading(true)
        const { data, error } = await supabase.from("cars").select("*").order("created_at", { ascending: false })

        if (error) {
          throw error
        }

        setCars(data || [])
      } catch (error: any) {
        console.error("Error fetching cars:", error)
        setError(error.message || "Failed to fetch cars")
      } finally {
        setLoading(false)
      }
    }

    fetchCars()
  }, [supabase])

  if (loading) {
    return (
      <div className="flex justify-center items-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-red-600" />
        <span className="ml-2">Chargement des véhicules...</span>
      </div>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            <p>Erreur: {error}</p>
            <p className="text-sm mt-2">Vérifiez votre connexion Supabase et les variables d'environnement.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Véhicules ({cars.length})</CardTitle>
        <Button asChild>
          <Link href="/admin/add">Ajouter un véhicule</Link>
        </Button>
      </CardHeader>
      <CardContent>
        {cars.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            <p>Aucun véhicule trouvé dans la base de données.</p>
            <p className="mt-2 text-sm">Commencez par ajouter des véhicules.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {cars.map((car) => (
              <div key={car.id} className="border rounded-md p-4">
                <div className="font-medium">{car.name}</div>
                <div className="text-sm text-gray-500 mt-1">
                  {car.brand} {car.model} - {car.year} - {car.price}€
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
