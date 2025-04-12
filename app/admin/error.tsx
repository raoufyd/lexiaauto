"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Admin error:", error)
  }, [error])

  return (
    <div className="container mx-auto px-4 py-16 max-w-md">
      <div className="bg-white rounded-lg shadow-md overflow-hidden p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Une erreur s'est produite</h2>
        <p className="mb-6 text-gray-600">
          Nous sommes désolés, une erreur s'est produite lors du chargement de cette page.
        </p>
        <div className="flex justify-center gap-4">
          <Button onClick={() => reset()} className="bg-red-600 hover:bg-red-700">
            Réessayer
          </Button>
          <Button variant="outline" asChild>
            <a href="/">Retour à l'accueil</a>
          </Button>
        </div>
      </div>
    </div>
  )
}
