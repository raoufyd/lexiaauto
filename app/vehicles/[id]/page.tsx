"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { getCarById } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, Edit, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { deleteCar } from "@/lib/actions";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { Phone, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getCars } from "@/lib/actions";
import CarCard from "@/components/car-card";
import { notFound } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export default function CarDetailsPage({ params }: { params: { id: string } }) {
  const [car, setCar] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [isCopied, setCopied] = useState<boolean>(false);
  const router = useRouter();
  const { user } = useAuth();
  const { id } = use(params);
  function copy(): void {
    navigator.clipboard.writeText(car.phone_number);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  }
  useEffect(() => {
    async function fetchCar() {
      try {
        const carData = await getCarById(id);
        if (!carData) {
          setError("Véhicule non trouvé");
          return;
        }

        setCar(carData);
        if (carData.images && carData.images.length > 0) {
          setActiveImage(carData.images[0].url);
        }
      } catch (err: any) {
        console.error("Error fetching car:", err);
        setError(
          err.message ||
            "Une erreur s'est produite lors du chargement du véhicule"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchCar();
  }, [id]);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteCar(id);
      if (result.success) {
        router.push("/admin");
      } else {
        setError(result.error || "Erreur lors de la suppression du véhicule");
        setDeleteDialogOpen(false);
      }
    } catch (err: any) {
      console.error("Error deleting car:", err);
      setError(
        err.message || "Une erreur s'est produite lors de la suppression"
      );
      setDeleteDialogOpen(false);
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-red-600" />
        <span className="ml-2">Chargement...</span>
      </div>
    );
  }

  if (error || !car) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error || "Véhicule non trouvé"}</p>
        </div>
        <Button onClick={() => router.back()} className="flex items-center">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>
      </div>
    );
  }

  // Format price with commas
  const formattedPrice =
    typeof car.price === "number"
      ? car.price.toLocaleString("fr-FR")
      : car.price;

  return (
    <div className="container mx-auto px-4 py-8">
      {user && (
        <div className="flex justify-end mb-6 gap-2">
          <Button asChild className="bg-red-600 hover:bg-red-700">
            <Link href={`/admin/edit/${car.id}`}>
              <Edit className="mr-2 h-4 w-4" />
              Modifier
            </Link>
          </Button>
          <Button
            variant="destructive"
            onClick={() => setDeleteDialogOpen(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Supprimer
          </Button>
        </div>
      )}
      <div className="flex justify-between items-center mb-6">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="flex items-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-6">{car.name}</h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Images Section */}
            <div>
              {car.images && car.images.length > 0 ? (
                <div>
                  <div className="relative h-[50rem] rounded-lg overflow-hidden mb-4 max-sm:h-[25rem]">
                    <Image
                      src={activeImage || car.images[0].url}
                      alt={car.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    {car.images.map((image: any) => (
                      <div
                        key={image.id}
                        className={`relative h-20 rounded-lg overflow-hidden cursor-pointer border-2 ${
                          activeImage === image.url
                            ? "border-red-600"
                            : "border-transparent hover:border-gray-300"
                        }`}
                        onClick={() => setActiveImage(image.url)}
                      >
                        <Image
                          src={image.url || "/placeholder.svg"}
                          alt={car.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-gray-100 h-[400px] rounded-lg flex items-center justify-center ">
                  <p className="text-gray-500">Aucune image disponible</p>
                </div>
              )}
            </div>

            {/* Details Section */}
            <div>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <h2 className="text-xl font-bold mb-4">
                    Informations générales
                  </h2>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Marque:</p>
                  <p className="font-medium">{car.brand}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Modèle:</p>
                  <p className="font-medium">{car.model}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Année:</p>
                  <p className="font-medium">{car.year}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Condition:</p>
                  <p className="font-medium">
                    {car.condition === "new"
                      ? "Neuf"
                      : car.condition === "-3ans"
                      ? "Moins de 3 ans"
                      : "Occasion"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Kilométrage:</p>
                  <p className="font-medium">
                    {car.mileage.toLocaleString("fr-FR")} km
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Catégorie:</p>
                  <p className="font-medium">{car.category}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Carburant:</p>
                  <p className="font-medium">{car.fuel_type}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Transmission:</p>
                  <p className="font-medium">{car.transmission}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Téléphone:</p>
                  <p className="font-medium">{car.phone_number}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Prix:</p>
                  <p className="text-xl font-bold">{formattedPrice}€</p>
                </div>
              </div>

              <div className="mt-8">
                <h2 className="text-xl font-bold mb-4">Description</h2>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="whitespace-pre-line">{car.description}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Car Details */}
      <div className="m-6 grid gap-8 md:grid-cols-2 lg:grid-cols-2">
        <div className="bg-white p-6 rounded-lg shadow-md max-h-48 ">
          <div className="flex items-center gap-4 mb-4">
            <div>
              <h4 className="font-bold">Documents administratifs :</h4>
            </div>
          </div>
          {car.condition == "new" ? (
            <div className="mb-4">
              <ul className={"list-disc list-inside"}>
                <li>Passeport algérien </li>
                <li>Carte consulaire CCR </li>
                <li>Licence Moudjahid </li>
                <li>Lettre de credit </li>
              </ul>
            </div>
          ) : (
            <div className="mb-4">
              <ul className={"list-disc list-inside"}>
                <li>Passeport algérien </li>
                <li>Résidence </li>
              </ul>
            </div>
          )}
          {/* <div className="-mb-[-48] ">
            <p className="text-sm mb-1">Email:</p>
            <p className="text-sm">lexiaauto6@gmail.com</p>
          </div> */}
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h1 className="text-2xl font-bold mb-2">{car.name}</h1>
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="outline">{car.year}</Badge>
            <Badge variant="outline">{car.transmission}</Badge>
            <Badge variant="outline">{car.fuel_type}</Badge>
          </div>

          <div className="mb-6">
            <div className="text-3xl font-bold  mb-1">{formattedPrice}€</div>
            <p className="text-sm text-gray-500">
              Tous nos prix sont Hors-Taxes.
            </p>
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Badge
                className={
                  car.condition === "new" ? "bg-green-500" : "bg-blue-500"
                }
              >
                {car.condition === "new"
                  ? "NEUF"
                  : car.condition === "-3ans"
                  ? "MOINS DE 3 ANS"
                  : "OCCASION"}
              </Badge>
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-bold mb-3">Contactez-nous</h3>
            <div className="space-y-3">
              <Button
                className="w-full flex items-center justify-center gap-2"
                onClick={() => copy()}
                id="myInput"
              >
                <Phone className="h-4 w-4" />
                {isCopied ? "Numéro copié avec succès" : car.phone_number}
              </Button>
              <Button
                className="w-full bg-green-500 hover:bg-green-600 flex items-center justify-center gap-2"
                onClick={() =>
                  window.open("https://wa.me/33755182366", "whatsapp")
                }
              >
                <MessageSquare className="h-4 w-4" />
                Chat par WhatsApp
              </Button>
            </div>
          </div>
        </div>
      </div>
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Êtes-vous sûr de vouloir supprimer ce véhicule?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Le véhicule et toutes ses images
              seront définitivement supprimés.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Suppression...
                </>
              ) : (
                "Supprimer"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
