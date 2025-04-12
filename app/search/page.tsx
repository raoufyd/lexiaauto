import { Button } from "@/components/ui/button"
import CarCard from "@/components/car-card"
import { searchCars } from "@/lib/actions"
import { Suspense } from "react"
import CarListingSkeleton from "@/components/car-listing-skeleton"
import SearchForm from "@/components/search-form"
import SortDropdown from "@/components/sort-dropdown"

export default async function SearchPage({
  searchParams,
}: {
  searchParams?: {
    query?: string
    sort?: string
  }
}) {
  const query = searchParams?.query || ""
  const sortOption = searchParams?.sort || "default"

  const cars = await searchCars(query)

  // Apply sorting
  let sortedCars = [...cars]
  if (sortOption !== "default") {
    sortedCars = sortedCars.sort((a, b) => {
      const priceA = typeof a.price === "number" ? a.price : Number.parseInt(a.price.toString())
      const priceB = typeof b.price === "number" ? b.price : Number.parseInt(b.price.toString())

      if (sortOption === "price-asc") {
        return priceA - priceB
      } else if (sortOption === "price-desc") {
        return priceB - priceA
      } else if (sortOption === "date-desc") {
        // Sort by created_at if available, otherwise keep original order
        if (a.created_at && b.created_at) {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        }
        return 0
      } else if (sortOption === "date-asc") {
        // Sort by created_at if available, otherwise keep original order
        if (a.created_at && b.created_at) {
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        }
        return 0
      }
      return 0
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Résultats de recherche</h1>

      <div className="flex flex-col md:flex-row gap-4 items-center mb-8">
        <div className="relative w-full md:w-1/2">
          <SearchForm defaultValue={query} />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <SortDropdown sortOption={sortOption} query={query} />
        </div>
      </div>

      {query && (
        <p className="mb-6 text-gray-600">
          {sortedCars.length} résultat(s) pour &quot;{query}&quot;
        </p>
      )}

      <Suspense fallback={<CarListingSkeleton />}>
        {sortedCars.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedCars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-2">Aucun résultat trouvé</h2>
            <p className="text-gray-600 mb-6">
              Nous n&apos;avons pas trouvé de véhicules correspondant à votre recherche.
            </p>
            <Button className="bg-red-600 hover:bg-red-700" asChild>
              <a href="/vehicles">Voir tous les véhicules</a>
            </Button>
          </div>
        )}
      </Suspense>
    </div>
  )
}
