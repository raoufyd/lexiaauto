import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import CarCard from "@/components/car-card"
import { getCars } from "@/lib/actions"
import { Suspense } from "react"
import CarListingSkeleton from "@/components/car-listing-skeleton"
import FilterSidebar from "@/components/filter-sidebar"
import SortDropdown from "@/components/sort-dropdown"

export default async function VehiclesPage({
  searchParams,
}: {
  searchParams?: {
    query?: string
    brand?: string
    category?: string
    minPrice?: string
    maxPrice?: string
    fuel?: string
    transmission?: string
    sort?: string
  }
}) {
  const query = searchParams?.query || ""
  const brandFilter = searchParams?.brand || ""
  const categoryFilter = searchParams?.category || ""
  const minPrice = searchParams?.minPrice ? Number.parseInt(searchParams.minPrice) : undefined
  const maxPrice = searchParams?.maxPrice ? Number.parseInt(searchParams.maxPrice) : undefined
  const fuelFilter = searchParams?.fuel || ""
  const transmissionFilter = searchParams?.transmission || ""
  const sortOption = searchParams?.sort || "default"

  // Get all cars
  const allCars = await getCars()

  // Apply filters
  let filteredCars = allCars.filter((car) => {
    // Filter by search query
    if (
      query &&
      !car.name.toLowerCase().includes(query.toLowerCase()) &&
      !car.brand.toLowerCase().includes(query.toLowerCase()) &&
      !car.model.toLowerCase().includes(query.toLowerCase())
    ) {
      return false
    }

    // Filter by brand
    if (brandFilter && car.brand !== brandFilter) {
      return false
    }

    // Filter by category
    if (categoryFilter && car.category !== categoryFilter) {
      return false
    }

    // Filter by price range
    const carPrice = typeof car.price === "number" ? car.price : Number.parseInt(car.price.toString())
    if (minPrice && carPrice < minPrice) {
      return false
    }
    if (maxPrice && carPrice > maxPrice) {
      return false
    }

    // Filter by fuel type
    if (fuelFilter && car.fuel_type !== fuelFilter) {
      return false
    }

    // Filter by transmission
    if (transmissionFilter && car.transmission !== transmissionFilter) {
      return false
    }

    return true
  })

  // Apply sorting
  if (sortOption !== "default") {
    filteredCars = [...filteredCars].sort((a, b) => {
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

  // Extract unique values for filters
  const brands = [...new Set(allCars.map((car) => car.brand))].sort()
  const categories = [...new Set(allCars.map((car) => car.category))].sort()
  const fuelTypes = [...new Set(allCars.map((car) => car.fuel_type))].sort()
  const transmissions = [...new Set(allCars.map((car) => car.transmission))].sort()

  // Find min and max prices
  const prices = allCars.map((car) =>
    typeof car.price === "number" ? car.price : Number.parseInt(car.price.toString()),
  )
  const minPriceValue = Math.min(...prices)
  const maxPriceValue = Math.max(...prices)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Trouvez la voiture de vos rêves</h1>
      <p className="text-gray-600 mb-8">
        Sélectionnez la catégorie, la marque, le modèle et différentes autres critères spécifiées pour obtenir la
        voiture de vos rêves.
      </p>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters */}
        <FilterSidebar
          brands={brands}
          categories={categories}
          fuelTypes={fuelTypes}
          transmissions={transmissions}
          minPrice={minPriceValue}
          maxPrice={maxPriceValue}
          selectedBrand={brandFilter}
          selectedCategory={categoryFilter}
          selectedFuel={fuelFilter}
          selectedTransmission={transmissionFilter}
          priceRange={[minPrice || minPriceValue, maxPrice || maxPriceValue]}
          searchQuery={query}
          sortOption={sortOption}
        />

        {/* Car Listings */}
        <div className="w-full lg:w-3/4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div className="relative w-full md:w-1/2">
              <form action="/vehicles" method="get">
                <Input
                  type="text"
                  name="query"
                  placeholder="Rechercher une voiture..."
                  className="pl-10 pr-4 py-2 w-full"
                  defaultValue={query}
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input type="hidden" name="brand" value={brandFilter} />
                <input type="hidden" name="category" value={categoryFilter} />
                <input type="hidden" name="fuel" value={fuelFilter} />
                <input type="hidden" name="transmission" value={transmissionFilter} />
                {minPrice && <input type="hidden" name="minPrice" value={minPrice} />}
                {maxPrice && <input type="hidden" name="maxPrice" value={maxPrice} />}
                <input type="hidden" name="sort" value={sortOption} />
                <Button type="submit" className="sr-only">
                  Rechercher
                </Button>
              </form>
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto">
              <SortDropdown
                sortOption={sortOption}
                query={query}
                brandFilter={brandFilter}
                categoryFilter={categoryFilter}
                fuelFilter={fuelFilter}
                transmissionFilter={transmissionFilter}
                minPrice={minPrice}
                maxPrice={maxPrice}
              />
            </div>
          </div>

          <Suspense fallback={<CarListingSkeleton />}>
            {filteredCars.length > 0 ? (
              <>
                <p className="mb-4 text-sm text-gray-500">{filteredCars.length} véhicules trouvés</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCars.map((car) => (
                    <CarCard key={car.id} car={car} />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-2">Aucun véhicule trouvé</h2>
                <p className="text-gray-600 mb-6">
                  Aucun véhicule ne correspond à vos critères de recherche. Veuillez modifier vos filtres.
                </p>
                <Button className="bg-red-600 hover:bg-red-700" asChild>
                  <a href="/vehicles">Réinitialiser les filtres</a>
                </Button>
              </div>
            )}
          </Suspense>

          {filteredCars.length > 0 && (
            <div className="flex justify-center mt-10">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" disabled>
                  &lt;
                </Button>
                <Button variant="outline" size="sm" className="bg-red-600 text-white">
                  1
                </Button>
                <Button variant="outline" size="sm">
                  2
                </Button>
                <Button variant="outline" size="sm">
                  3
                </Button>
                <Button variant="outline" size="icon">
                  &gt;
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
