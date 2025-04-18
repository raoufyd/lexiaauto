import Link from "next/link"
import Image from "next/image"
import { Facebook, Instagram, Mail, Phone } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="inline-block mb-4">
              <Image
                src="/placeholder.svg?height=50&width=150"
                alt="Auto Export Logo"
                width={150}
                height={50}
                className="h-10 w-auto"
              />
            </Link>
            <p className="text-sm text-gray-400 mb-4">
              Nous sommes spécialisés dans la vente des véhicules neufs & d&apos;occasion avec prise en charge de
              l&apos;export Algérie.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">SEGMENTS</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/buy" className="text-gray-400 hover:text-white transition-colors">
                  Achat
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                  Politique de confidentialité
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                  Termes et conditions
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-gray-400 hover:text-white transition-colors">
                  Services
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">USEFUL INFO</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/vehicles" className="text-gray-400 hover:text-white transition-colors">
                  Véhicules neufs
                </Link>
              </li>
              <li>
                <Link href="/procedure" className="text-gray-400 hover:text-white transition-colors">
                  Procédure d&apos;achat
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-gray-400 hover:text-white transition-colors">
                  Politique de cookies
                </Link>
              </li>
              <li>
                <Link href="/legal" className="text-gray-400 hover:text-white transition-colors">
                  Mentions légales
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">HORAIRES DE TRAVAIL</h3>
            <p className="text-gray-400 mb-2">Lundi - Vendredi: 9h - 18h</p>
            <p className="text-gray-400 mb-4">Samedi: 9h - 17h30</p>

            <div className="flex items-center mb-2">
              <Phone className="h-4 w-4 mr-2 text-red-600" />
              <span className="text-gray-400">+33 6 65 64 72 03</span>
            </div>
            <div className="flex items-center">
              <Mail className="h-4 w-4 mr-2 text-red-600" />
              <span className="text-gray-400">autoexport@gmail.com</span>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} | Auto Export. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  )
}
