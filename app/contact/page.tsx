import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Phone, Mail, MapPin } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-2">Contactez-nous</h1>
      <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto">
        Nous sommes là pour répondre à toutes vos questions. N&apos;hésitez pas
        à nous contacter par téléphone, email ou en remplissant le formulaire
        ci-dessous.
      </p>

      <div className="grid md:grid-cols-2 gap-10">
        <div>
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-bold mb-4">Informations de contact</h2>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="bg-red-100 p-3 rounded-full">
                  <Phone className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <h3 className="font-bold">Téléphone</h3>
                  <p className="text-gray-600">+33 6 07 35 74 08</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-red-100 p-3 rounded-full">
                  <Mail className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <h3 className="font-bold">Email</h3>
                  <p className="text-gray-600">lexiaauto6@gmail.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-red-100 p-3 rounded-full">
                  <MapPin className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <h3 className="font-bold">Adresse</h3>
                  <p className="text-gray-600">
                    30 Chemin de Casselevres, 31790 saint-Jory, France
                  </p>
                  <p className="text-sm text-red-600 font-medium">
                    UNIQUEMENT SUR RENDEZ-VOUS
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">
              Horaires d&apos;ouverture
            </h2>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Lundi - samedi:</span>
                <span>9h - 19h</span>
              </div>

              <div className="flex justify-between">
                <span>Dimanche:</span>
                <span>Fermé</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Envoyez-nous un message</h2>

          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium mb-1"
                >
                  Nom complet
                </label>
                <Input id="name" type="text" placeholder="Votre nom" />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-1"
                >
                  Email
                </label>
                <Input id="email" type="email" placeholder="Votre email" />
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium mb-1">
                Téléphone
              </label>
              <Input
                id="phone"
                type="tel"
                placeholder="Votre numéro de téléphone"
              />
            </div>

            <div>
              <label
                htmlFor="subject"
                className="block text-sm font-medium mb-1"
              >
                Sujet
              </label>
              <Input
                id="subject"
                type="text"
                placeholder="Sujet de votre message"
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium mb-1"
              >
                Message
              </label>
              <textarea
                id="message"
                className="w-full p-3 border rounded-md min-h-[150px]"
                placeholder="Votre message"
              ></textarea>
            </div>

            <div className="flex items-center gap-2">
              <input type="checkbox" id="terms" />
              <label htmlFor="terms" className="text-sm">
                J&apos;accepte les mentions légales
              </label>
            </div>

            <Button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700"
            >
              Envoyer le message
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
