"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export default function MobileMenu() {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[400px]">
        <div className="flex flex-col gap-6 mt-10">
          <Link
            href="/"
            className="text-lg font-medium hover:text-red-600 transition-colors"
            onClick={() => setOpen(false)}
          >
            ACCUEIL
          </Link>
          <Link
            href="/vehicles"
            className="text-lg font-medium hover:text-red-600 transition-colors"
            onClick={() => setOpen(false)}
          >
            VÉHICULES
          </Link>
          <Link
            href="/services"
            className="text-lg font-medium hover:text-red-600 transition-colors"
            onClick={() => setOpen(false)}
          >
            SERVICES
          </Link>
          <Link
            href="/about"
            className="text-lg font-medium hover:text-red-600 transition-colors"
            onClick={() => setOpen(false)}
          >
            À PROPOS DE NOUS
          </Link>
          <Link
            href="/contact"
            className="text-lg font-medium hover:text-red-600 transition-colors"
            onClick={() => setOpen(false)}
          >
            CONTACT
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  )
}
