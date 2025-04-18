"use client";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Image from "next/image";
import { Phone, MessageSquare, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import CarCard from "@/components/car-card";
import ServiceCard from "@/components/service-card";
import { getCars } from "@/lib/actions";
import SearchForm from "@/components/search-form";
import { useEffect, useState } from "react";
import HeroCarousel from "@/components/hero-carousel";
import ServicesCarousel from "@/components/services-carousel";
import { useIsMobile } from "@/hooks/use-mobile";
import { Car } from "@/lib/types";
import BrandCarousel from "@/components/brand-carousel";
export default function Home() {
  const isMobile = useIsMobile();
  const [allCars, setAllCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  // Liste des marques de voitures
  const carBrands = [
    {
      name: "Mercedes",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Mercedes-Benz_Star_2022.svg/1200px-Mercedes-Benz_Star_2022.svg.png",
    },
    {
      name: "BMW",
      logo: "https://www.bmw.com/etc.clientlibs/settings/wcm/designs/bmwcom/base/resources/ci2020/img/logo-bmw-com-gray.svg",
    },
    {
      name: "Audi",
      logo: "https://uploads.audi-mediacenter.com/system/production/media/116125/images/74022a65b478f7b3a8e0bf8ba70994f66fde5dd7/A231415_web_1440.jpg?1698528985",
    },
    {
      name: "Peugeot",
      logo: "https://upload.wikimedia.org/wikipedia/en/thumb/9/9d/Peugeot_2021_Logo.svg/1200px-Peugeot_2021_Logo.svg.png",
    },
    {
      name: "Renault",
      logo: "https://cdn.cookielaw.org/logos/1058e0b9-ee95-4d43-8292-3dae40ce5c3c/01937720-930b-77db-9c6d-5f2dfbccd09b/f1496116-d86b-48fd-aa1a-4c4691d73586/renault-logo-0-1.png",
    },
    {
      name: "Citroën",
      logo: "https://www.citroen.fr/content/dam/citroen/master/b2c/home/logo/logo858x558.PNG",
    },
    {
      name: "Volkswagen",
      logo: "https://uploads.vw-mms.de/system/production/images/vwn/030/145/images/7a0d84d3b718c9a621100e43e581278433114c82/DB2019AL01950_retina_2000.jpg?1649155356",
    },
    {
      name: "Toyota",
      logo: "https://brand.toyota.com/content/dam/brandhub/guidelines/logo/four-column/BHUB_Logo_LogoFamily_01.svg",
    },
    {
      name: "Ford",
      logo: "https://www.ford.fr/content/dam/guxeu/global-shared/header/ford_oval_blue_logo.svg",
    },
  ];

  useEffect(() => {
    async function fetchCars() {
      try {
        const cars = await getCars();
        setAllCars(cars);
      } finally {
        setLoading(false);
      }
    }
    fetchCars();
  }, []);

  const newfeaturedCars = allCars.filter((car: Car) => car.condition === "new");
  const moins3ansfeaturedCars = allCars.filter(
    (car: Car) => car.condition === "-3ans"
  );

  if (loading)
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-red-600" />
        <span className="ml-2">Chargement...</span>
      </div>
    );
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        {/* Hero Section */}
        {/* Hero Section with Carousel */}
        <section className="relative">
          <HeroCarousel />
        </section>
        {/* Car Brands Logo Section */}

        <section className="py-12 bg-slate-100">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-8">
              Nos Marques Disponibles
            </h2>

            <BrandCarousel brands={carBrands} />

            <p className="text-center text-gray-600 mt-8 max-w-2xl mx-auto">
              Spécialiste de l'exportation de véhicules neufs et d'occasion de
              toutes marques vers l'Algérie et l'Afrique
            </p>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-2">
              Nos Services
            </h2>
            <p className="text-center text-gray-600 mb-10 max-w-3xl mx-auto">
              Notre équipe est une concession spécialisée dans
              l&apos;exportation de véhicules neufs vers l&apos;Afrique et
              l&apos;Algérie plus particulièrement, toutes les marques. Notre
              mission est de vous procurer un véhicule du meilleur prix, tout en
              proposant une livraison de qualité.
            </p>

            {isMobile ? (
              <ServicesCarousel />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <ServiceCard
                  icon="car"
                  title="Achat d'une Voiture"
                  description="Nous proposons des véhicules neufs et d'occasions pour l'exportation."
                />
                <ServiceCard
                  icon="search"
                  title="Trouver Une Voiture"
                  description="Nous vous aidons à trouver le véhicule qui vous convient aux meilleurs prix."
                />
                <ServiceCard
                  icon="shield"
                  title="Achat Sécurisé"
                  description="Nous garantissons des moyens de paiement sécurisés et simples."
                />
                <ServiceCard
                  icon="ship"
                  title="Gestion De L'expédition"
                  description="Nous nous occupons de l'expédition de votre véhicule vers l'Algérie."
                />
              </div>
            )}
          </div>
        </section>

        {/* Featured Cars Section */}
        <section className="py-12 bg-slate-100">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-10">
              Véhicules Neufs
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {newfeaturedCars.slice(0, 4).map((car) => (
                <CarCard key={car?.id} car={car} />
              ))}
            </div>

            <div className="flex justify-center mt-10">
              <Link href="/vehicles?condition=new">
                <Button className="bg-red-600 hover:bg-red-700">
                  Voir Tout Les Véhicules neufs
                </Button>
              </Link>
            </div>
          </div>

          <div className="container m-4 mt-8 mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-10">
              Véhicules de moins - 3 ans
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {moins3ansfeaturedCars.slice(0, 4).map((car) => (
                <CarCard key={car?.id} car={car} />
              ))}
            </div>

            <div className="flex justify-center mt-10">
              <Link href="/vehicles?condition=-3ans">
                <Button className="bg-red-600 hover:bg-red-700">
                  Voir Tout Les Véhicules de -3 ans
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-10">
              Témoignages
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <p className="text-gray-600 mb-4">
                  "J'ai acheté une voiture pour mon père (exportation vers
                  l'Algérie) chez AUTO EXPORT. L'équipe était disponible et
                  toujours en contact pendant le processus. Merveilleux travail
                  et très professionnel. Je les recommande."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                  <span className="font-medium">Ali Bensalem</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <p className="text-gray-600 mb-4">
                  "Je viens d'acquérir un véhicule équipé de la climatisation
                  que je souhaitais. Dès le premier contact que j'ai eu avec
                  eux, j'ai eu l'impression de les connaître depuis longtemps.
                  Accueil sympathique, livraison et accompagnement sans
                  problème."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                  <span className="font-medium">Mohamed Chabane</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <p className="text-gray-600 mb-4">
                  "Service irréprochable ! C'est un plaisir de traiter avec
                  cette société. Ils sont à l'écoute et font tout pour trouver
                  LA voiture idéale pour vous. Bon courage et bonne
                  continuation."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                  <span className="font-medium">Abdelhafid Yahiaoui</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-12 bg-slate-100">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div>
                <h2 className="text-3xl font-bold mb-6">Retrouvez-nous</h2>
                <p className="mb-4">Nous sommes disponibles du:</p>
                <p className="mb-2">Lundi au vendredi entre 9h et 18h</p>
                <p className="mb-2">Le samedi de 9h à 17h30</p>
                <p className="mb-6">Fermés les jours fériés</p>

                <div className="flex items-center mb-4">
                  <Phone className="h-5 w-5 mr-2 text-red-600" />
                  <span className="font-bold">+33 6 65 64 72 03</span>
                </div>

                <div className="flex items-center mb-6">
                  <MessageSquare className="h-5 w-5 mr-2 text-red-600" />
                  <span>autoexport@gmail.com</span>
                </div>

                <div className="mb-6">
                  <p className="font-bold mb-2">UNIQUEMENT SUR RENDEZ-VOUS</p>
                  <p>505 Avenue du Prado</p>
                  <p>13008 Marseille, France</p>
                </div>

                <div className="flex items-center">
                  <Button className="bg-green-500 hover:bg-green-600 flex items-center">
                    <Image
                      src="/placeholder.svg?height=24&width=24"
                      alt="WhatsApp"
                      width={24}
                      height={24}
                      className="mr-2"
                    />
                    DISCUTEZ AVEC SUR WHATSAPP
                  </Button>
                </div>
              </div>

              <div>
                <form className="bg-white p-6 rounded-lg shadow-md">
                  <div className="grid grid-cols-1 gap-4 mb-4">
                    <Input type="text" placeholder="Nom" />
                    <Input type="email" placeholder="E-mail" />
                    <Input type="tel" placeholder="Téléphone" />
                    <textarea
                      className="w-full p-3 border rounded-md min-h-[150px]"
                      placeholder="Commentaire ou message"
                    ></textarea>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-red-600 hover:bg-red-700"
                  >
                    Envoyer
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
