"use client"

import { useState, type FormEvent } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

interface SearchFormProps {
  defaultValue?: string
  className?: string
}

export default function SearchForm({ defaultValue = "", className = "" }: SearchFormProps) {
  const [query, setQuery] = useState(defaultValue)
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    // Build the query parameters
    const params = new URLSearchParams()

    if (query.trim()) {
      params.set("query", query)
    }

    // Preserve the sort parameter if it exists
    const sort = searchParams.get("sort")
    if (sort) {
      params.set("sort", sort)
    }

    // Navigate to the search page with the parameters
    router.push(`/search?${params.toString()}`)
  }

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <Input
        type="text"
        placeholder="Rechercher une voiture..."
        className="pl-10 pr-4 py-2 w-full"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
      <Button
        type="submit"
        className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-red-600 hover:bg-red-700 h-8 px-3"
      >
        Rechercher
      </Button>
    </form>
  )
}
