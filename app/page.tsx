import { Input } from "@/components/ui/input"
import Link from "next/link"
import Image from "next/image"
import { Phone, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import CarCard from "@/components/car-card"
import ServiceCard from "@/components/service-card"
import { getCars } from "@/lib/actions"
import SearchForm from "@/components/search-form"

export default async function Home() {
  const allCars = await getCars()
  const featuredCars = allCars.slice(0, 4)

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative">
          <div className="relative h-[500px] overflow-hidden">
            <Image
              src="/placeholder.svg?height=500&width=1200"
              alt="Car Export"
              width={1200}
              height={500}
              className="object-cover w-full"
              priority
            />
            <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white p-4 text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">AUTO EXPORT</h1>
              <p className="text-xl md:text-2xl mb-8">
                Véhicules neufs et d&apos;occasions pour export vers l&apos;Afrique
              </p>
              <Link href="/vehicles">
                <Button size="lg" className="bg-red-600 hover:bg-red-700">
                  Découvrir nos Véhicules
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Search Section */}
        <section className="py-8 bg-slate-100">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
              <div className="relative w-full md:w-1/2">
                <SearchForm />
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-2">Nos Services</h2>
            <p className="text-center text-gray-600 mb-10 max-w-3xl mx-auto">
              Notre équipe est une concession spécialisée dans l&apos;exportation de véhicules neufs vers l&apos;Afrique
              et l&apos;Algérie plus particulièrement, toutes les marques. Notre mission est de vous procurer un
              véhicule du meilleur prix, tout en proposant une livraison de qualité.
            </p>

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
          </div>
        </section>

        {/* Featured Cars Section */}
        <section className="py-12 bg-slate-100">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-10">Voitures Neuves</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredCars.map((car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>

            <div className="flex justify-center mt-10">
              <Link href="/vehicles">
                <Button className="bg-red-600 hover:bg-red-700">Voir Toutes Les Voitures</Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-10">Témoignages</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <p className="text-gray-600 mb-4">
                  "J'ai acheté une voiture pour mon père (exportation vers l'Algérie) chez AUTO EXPORT. L'équipe était
                  disponible et toujours en contact pendant le processus. Merveilleux travail et très professionnel. Je
                  les recommande."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                  <span className="font-medium">Ali Bensalem</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <p className="text-gray-600 mb-4">
                  "Je viens d'acquérir un véhicule équipé de la climatisation que je souhaitais. Dès le premier contact
                  que j'ai eu avec eux, j'ai eu l'impression de les connaître depuis longtemps. Accueil sympathique,
                  livraison et accompagnement sans problème."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                  <span className="font-medium">Mohamed Chabane</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <p className="text-gray-600 mb-4">
                  "Service irréprochable ! C'est un plaisir de traiter avec cette société. Ils sont à l'écoute et font
                  tout pour trouver LA voiture idéale pour vous. Bon courage et bonne continuation."
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
                  <Button type="submit" className="w-full bg-red-600 hover:bg-red-700">
                    Envoyer
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
