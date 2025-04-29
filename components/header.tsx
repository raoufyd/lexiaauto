"use client";
import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import MobileMenu from "@/components/mobile-menu";
import { useState } from "react";

export default function Header() {
  const [isCopied, setCopied] = useState(false);
  function copy(): void {
    navigator.clipboard.writeText("+33 7 55 18 23 66");
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  }
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      {/* Top bar */}
      <div className="bg-red-600 text-white py-1">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center text-sm" onClick={() => copy()}>
            <Phone className="h-3 w-3 mr-1" />
            <span className="mr-5">
              {isCopied ? "Numéro copié avec succès" : "+33 7 55 18 23 66"}
            </span>
            <a href="https://www.tiktok.com/@lexia.auto.export?_t=ZN-8vpzdviuzfK&_r=1">
              <div className="bg-white rounded-xl w-6 h-6 flex justify-center">
                <Image
                  src={"/tiktok-1.svg"}
                  alt={`Logo tiktok`}
                  width={20}
                  height={20}
                  className="object-contain"
                />
              </div>
            </a>
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
              src="/logogpt-removebg-preview.png"
              alt="Auto Export Logo"
              width={200}
              height={200}
              className="h-12 w-auto "
            />
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className="font-medium hover:text-red-600 transition-colors"
            >
              ACCUEIL
            </Link>
            <Link
              href="/vehicles"
              className="font-medium hover:text-red-600 transition-colors"
            >
              VÉHICULES
            </Link>
            <Link
              href="/services"
              className="font-medium hover:text-red-600 transition-colors"
            >
              SERVICES
            </Link>
            <Link
              href="/about"
              className="font-medium hover:text-red-600 transition-colors"
            >
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
  );
}
