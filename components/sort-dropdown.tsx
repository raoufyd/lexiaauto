"use client"

import type React from "react"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

interface SortDropdownProps {
  sortOption: string
  query?: string
  brandFilter?: string
  categoryFilter?: string
  fuelFilter?: string
  transmissionFilter?: string
  minPrice?: number
  maxPrice?: number
}

export default function SortDropdown({
  sortOption = "default",
  query = "",
  brandFilter = "",
  categoryFilter = "",
  fuelFilter = "",
  transmissionFilter = "",
  minPrice,
  maxPrice,
}: SortDropdownProps) {
  const router = useRouter()
  const [sort, setSort] = useState(sortOption)

  useEffect(() => {
    setSort(sortOption)
  }, [sortOption])

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSort = e.target.value
    setSort(newSort)

    // Build the query parameters
    const params = new URLSearchParams()

    if (query) params.set("query", query)
    if (brandFilter) params.set("brand", brandFilter)
    if (categoryFilter) params.set("category", categoryFilter)
    if (fuelFilter) params.set("fuel", fuelFilter)
    if (transmissionFilter) params.set("transmission", transmissionFilter)
    if (minPrice) params.set("minPrice", minPrice.toString())
    if (maxPrice) params.set("maxPrice", maxPrice.toString())
    if (newSort !== "default") params.set("sort", newSort)

    // Navigate to the new URL
    router.push(`/vehicles?${params.toString()}`)
  }

  return (
    <>
      <span className="text-sm text-gray-500">Trier par:</span>
      <select className="border rounded-md p-2 text-sm w-full md:w-auto" value={sort} onChange={handleSortChange}>
        <option value="default">Trier par</option>
        <option value="price-asc">Prix: Croissant</option>
        <option value="price-desc">Prix: Décroissant</option>
        <option value="date-desc">Date: Plus récent</option>
        <option value="date-asc">Date: Plus ancien</option>
      </select>
    </>
  )
}
