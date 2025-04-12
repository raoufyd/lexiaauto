import Link from "next/link"
import Image from "next/image"
import { Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import MobileMenu from "@/components/mobile-menu"

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      {/* Top bar */}
      <div className="bg-red-600 text-white py-1">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center text-sm">
            <Phone className="h-3 w-3 mr-1" />
            <span>+33 6 65 64 72 03</span>
          </div>
          <Link href="/contact" className="text-sm hover:underline">
            Contactez-nous
          </Link>
        </div>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <Image
              src="/placeholder.svg?height=50&width=150"
              alt="Auto Export Logo"
              width={150}
              height={50}
              className="h-10 w-auto"
            />
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className="font-medium hover:text-red-600 transition-colors">
              ACCUEIL
            </Link>
            <Link href="/vehicles" className="font-medium hover:text-red-600 transition-colors">
              VÉHICULES
            </Link>
            <Link href="/services" className="font-medium hover:text-red-600 transition-colors">
              SERVICES
            </Link>
            <Link href="/about" className="font-medium hover:text-red-600 transition-colors">
              À PROPOS DE NOUS
            </Link>
            <Link href="/contact">
              <Button className="bg-red-600 hover:bg-red-700">CONTACT</Button>
            </Link>
          </div>

          <div className="md:hidden">
            <MobileMenu />
          </div>
        </div>
      </div>
    </header>
  )
}
