"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Carousel from "@/components/carousel";

const heroImages = [
  {
    src: "/cles-voiture.avif",
    alt: "Car Export 1",
    title: "LEXIA AUTO EXPORT",
    subtitle:
      "Suivi personnalisé et envoi sécurisé vers l’Algérie et l’Afrique",
  },
  {
    src: "/pexels-bylukemiller-29566901.jpg",
    alt: "Car Export 2",
    title: "LEXIA AUTO EXPORT",
    subtitle: "Export de véhicules neufs et d’occasion vers toute l’Afrique.",
  },
  {
    src: "/elegante-femme-noire-dans-salon-automobile_1157-21401.avif",
    alt: "Car Export 3",
    title: "LEXIA AUTO EXPORT",
    subtitle: "Spécialiste de l’export auto vers l’Afrique neufs et occasions.",
  },
];

export default function HeroCarousel() {
  return (
    <Carousel
      autoSlideInterval={3000}
      showArrows={false}
      className="h-[500px] relative"
      indicatorClassName="w-3 h-3"
    >
      {heroImages.map((image, index) => (
        <div key={index} className="relative h-[500px] w-full">
          <Image
            src={image.src || "/placeholder.svg"}
            alt={image.alt}
            fill
            className="object-cover"
            priority={index === 0}
          />
          <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white p-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {image.title}
            </h1>
            <p className="text-xl md:text-2xl mb-8">{image.subtitle}</p>
            <Link href="/vehicles">
              <Button size="lg" className="bg-red-600 hover:bg-red-700">
                Découvrir nos Véhicules
              </Button>
            </Link>
          </div>
        </div>
      ))}
    </Carousel>
  );
}
