"use client"

import type React from "react"

import { useAuth } from "@/lib/auth-context"
import { useRouter, usePathname } from "next/navigation"
import { useEffect } from "react"
import { Loader2 } from "lucide-react"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  // Public routes that don't require authentication
  const publicRoutes = ["/admin/login", "/admin/register"]
  const isPublicRoute = publicRoutes.some((route) => pathname?.startsWith(route))

  useEffect(() => {
    if (!loading) {
      if (!user && !isPublicRoute) {
        router.push("/admin/login")
      } else if (user && isPublicRoute) {
        router.push("/admin")
      }
    }
  }, [user, loading, isPublicRoute, router])

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-red-600" />
        <span className="ml-2">Chargement...</span>
      </div>
    )
  }

  // If not authenticated and not on a public route, don't render children
  if (!user && !isPublicRoute) {
    return null
  }

  return <>{children}</>
}
