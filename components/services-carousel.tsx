"use client";

import Carousel from "@/components/carousel";
import ServiceCard from "@/components/service-card";

const services = [
  {
    icon: "car",
    title: "Achat d'une Voiture",
    description:
      "Nous proposons des véhicules neufs et d'occasions pour l'exportation.",
  },
  {
    icon: "search",
    title: "Trouver Une Voiture",
    description:
      "Nous vous aidons à trouver le véhicule qui vous convient aux meilleurs prix.",
  },
  {
    icon: "shield",
    title: "Achat Sécurisé",
    description:
      "Nous garantissons des moyens de paiement sécurisés et simples.",
  },
  {
    icon: "ship",
    title: "Gestion De L'expédition",
    description:
      "Nous nous occupons de l'expédition de votre véhicule vers l'Algérie.",
  },
];

export default function ServicesCarousel() {
  // For mobile, we'll show one service at a time
  // For desktop, we'll show all services at once
  return (
    <>
      {/* Mobile carousel (visible on small screens) */}
      <div className="md:hidden">
        <Carousel autoSlideInterval={3000} className="w-full py-4">
          {services.map((service, index) => (
            <div key={index} className="px-4 flex justify-center">
              <ServiceCard
                icon={service.icon}
                title={service.title}
                description={service.description}
              />
            </div>
          ))}
        </Carousel>
      </div>

      {/* Desktop grid (visible on medium screens and up) */}
      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {services.map((service, index) => (
          <ServiceCard
            key={index}
            icon={service.icon}
            title={service.title}
            description={service.description}
          />
        ))}
      </div>
    </>
  );
}
