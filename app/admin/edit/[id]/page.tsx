"use client";

import type React from "react";

import { useState, useEffect, use } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  getCarById,
  getCarBrands,
  getCarCategories,
  updateCar,
} from "@/lib/actions";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/lib/auth-context";
import { Loader2 } from "lucide-react";

export default function EditCarPage({ params }: { params: { id: string } }) {
  const [car, setCar] = useState<any>(null);
  const [brands, setBrands] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { user } = useAuth();
  const { id } = use(params);

  useEffect(() => {
    async function fetchData() {
      try {
        const [carData, brandsData, categoriesData] = await Promise.all([
          getCarById(id),
          getCarBrands(),
          getCarCategories(),
        ]);

        if (!carData) {
          setError("Véhicule non trouvé");
          return;
        }

        setCar(carData);
        setBrands(brandsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Erreur lors du chargement des données");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      await updateCar(id, formData);
      router.push("/admin");
    } catch (error) {
      console.error("Error updating car:", error);
      // In a real app, you would handle this error and show a message to the user
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-red-600" />
        <span className="ml-2">Chargement...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
        <Button className="mt-4" onClick={() => router.back()}>
          Retour
        </Button>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded">
          <p>Véhicule non trouvé</p>
        </div>
        <Button className="mt-4" onClick={() => router.back()}>
          Retour
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Modifier un véhicule</h1>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="name">Nom du véhicule</Label>
                <Input id="name" name="name" defaultValue={car.name} required />
              </div>
              <div>
                <Label htmlFor="brand">Marque</Label>
                <select
                  id="brand"
                  name="brand"
                  className="w-full p-2 border rounded-md"
                  defaultValue={car.brand}
                  required
                >
                  <option value="">Sélectionner une marque</option>
                  {brands.map((brand) => (
                    <option key={brand} value={brand}>
                      {brand}
                    </option>
                  ))}
                  <option value="new">+ Ajouter une marque</option>
                </select>
              </div>
              <div>
                <Label htmlFor="model">Modèle</Label>
                <Input
                  id="model"
                  name="model"
                  defaultValue={car.model}
                  required
                />
              </div>
              <div>
                <Label htmlFor="year">Année</Label>
                <Input
                  id="year"
                  name="year"
                  type="number"
                  defaultValue={car.year}
                  required
                />
              </div>
              <div>
                <Label htmlFor="price">Prix (€)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  defaultValue={car.price}
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Numéro de téléphone</Label>
                <Input
                  id="phone"
                  name="phone_number"
                  defaultValue={car.phone_number}
                  required
                />
              </div>
              <div>
                <Label htmlFor="condition">Condition</Label>
                <select
                  id="condition"
                  name="condition"
                  className="w-full p-2 border rounded-md"
                  defaultValue={car.condition}
                  required
                >
                  <option value="">Sélectionner une condition</option>
                  <option value="new">Neuf</option>
                  <option value="-3ans">Moins de 3 ans</option>
                  <option value="used">Occasion</option>
                </select>
              </div>
              <div>
                <Label htmlFor="mileage">Kilométrage</Label>
                <Input
                  id="mileage"
                  name="mileage"
                  type="number"
                  defaultValue={car.mileage}
                  required
                />
              </div>
              <div>
                <Label htmlFor="category">Catégorie</Label>
                <select
                  id="category"
                  name="category"
                  className="w-full p-2 border rounded-md"
                  defaultValue={car.category}
                  required
                >
                  <option value="">Sélectionner une catégorie</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                  <option value="new">+ Ajouter une catégorie</option>
                </select>
              </div>
              <div>
                <Label htmlFor="fuel_type">Type de carburant</Label>
                <select
                  id="fuel_type"
                  name="fuel_type"
                  className="w-full p-2 border rounded-md"
                  defaultValue={car.fuel_type}
                  required
                >
                  <option value="">Sélectionner un type de carburant</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Essence">Essence</option>
                  <option value="Hybride">Hybride</option>
                  <option value="Électrique">Électrique</option>
                </select>
              </div>
              <div>
                <Label htmlFor="transmission">Transmission</Label>
                <select
                  id="transmission"
                  name="transmission"
                  className="w-full p-2 border rounded-md"
                  defaultValue={car.transmission}
                  required
                >
                  <option value="">Sélectionner une transmission</option>
                  <option value="Manuelle">Manuelle</option>
                  <option value="Automatique">Automatique</option>
                  <option value="Semi-automatique">Semi-automatique</option>
                </select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                defaultValue={car.description}
                className="min-h-[200px]"
                required
              />
            </div>

            {car.images && car.images.length > 0 && (
              <div>
                <Label>Images actuelles</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                  {car.images.map((image: any) => (
                    <div
                      key={image.id}
                      className="relative h-40 rounded-lg overflow-hidden"
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
            )}

            <div>
              <Label htmlFor="images">Ajouter des images</Label>
              <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                <div className="text-center">
                  <div className="mt-4 flex text-sm leading-6 text-gray-600">
                    <label
                      htmlFor="images"
                      className="relative cursor-pointer rounded-md bg-white font-semibold text-red-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-red-600 focus-within:ring-offset-2 hover:text-red-500"
                    >
                      <span>Télécharger des fichiers</span>
                      <input
                        id="images"
                        name="images"
                        type="file"
                        className="sr-only"
                        multiple
                        accept="image/*"
                      />
                    </label>
                    <p className="pl-1">ou glisser-déposer</p>
                  </div>
                  <p className="text-xs leading-5 text-gray-600">
                    PNG, JPG, GIF jusqu&apos;à 10MB
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                variant="outline"
                type="button"
                onClick={() => router.back()}
              >
                Annuler
              </Button>
              <Button className="bg-red-600 hover:bg-red-700" type="submit">
                Mettre à jour le véhicule
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
