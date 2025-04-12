"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getCarBrands, getCarCategories } from "@/lib/actions";
import { createCar } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Loader2, X, ImageIcon } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function AddCarPage() {
  const [brands, setBrands] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [newBrand, setNewBrand] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    async function fetchData() {
      try {
        const [brandsData, categoriesData] = await Promise.all([
          getCarBrands(),
          getCarCategories(),
        ]);
        setBrands(brandsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newFiles = Array.from(files);
    setSelectedFiles((prev) => [...prev, ...newFiles]);

    // Generate preview URLs
    const newPreviewUrls = newFiles.map((file) => URL.createObjectURL(file));
    setPreviewUrls((prev) => [...prev, ...newPreviewUrls]);
  };

  // Remove a selected file
  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));

    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(previewUrls[index]);
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  // Handle brand selection
  const handleBrandChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedBrand(value);
    if (value !== "new") {
      setNewBrand("");
    }
  };

  // Handle category selection
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedCategory(value);
    if (value !== "new") {
      setNewCategory("");
    }
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const formData = new FormData(e.currentTarget);

      // Handle brand selection
      if (selectedBrand === "new" && newBrand.trim()) {
        formData.set("brand", newBrand.trim());
      }

      // Handle category selection
      if (selectedCategory === "new" && newCategory.trim()) {
        formData.set("category", newCategory.trim());
      }

      // Add selected files to formData
      formData.delete("images");
      selectedFiles.forEach((file) => {
        formData.append("images", file);
      });

      const result = await createCar(formData);

      if (!result.success) {
        setError(result.error);
        if (result.error === "Not authenticated") {
          // If not authenticated, redirect to login
          router.push("/admin/login");
        }
        return;
      }

      // Success - redirect to admin page
      router.push("/admin");
    } catch (error: any) {
      console.error("Error creating car:", error);
      setError(error.message || "An error occurred while creating the car");
    } finally {
      setSubmitting(false);
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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Ajouter un véhicule</h1>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="name">Nom du véhicule</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Ex: CITROËN BERLINGO UTILITAIRE 1.6 HDI"
                  required
                />
              </div>
              <div>
                <Label htmlFor="brand">Marque</Label>
                <select
                  id="brand"
                  name="brand"
                  className="w-full p-2 border rounded-md"
                  required
                  value={selectedBrand}
                  onChange={handleBrandChange}
                >
                  <option value="">Sélectionner une marque</option>
                  {brands.map((brand) => (
                    <option key={brand} value={brand}>
                      {brand}
                    </option>
                  ))}
                  <option value="new">+ Ajouter une nouvelle marque</option>
                </select>

                {selectedBrand === "new" && (
                  <div className="mt-2">
                    <Input
                      placeholder="Entrez le nom de la nouvelle marque"
                      value={newBrand}
                      onChange={(e) => setNewBrand(e.target.value)}
                      required
                    />
                  </div>
                )}
              </div>
              <div>
                <Label htmlFor="model">Modèle</Label>
                <Input
                  id="model"
                  name="model"
                  placeholder="Ex: BERLINGO"
                  required
                />
              </div>
              <div>
                <Label htmlFor="year">Année</Label>
                <Input
                  id="year"
                  name="year"
                  type="number"
                  placeholder="Ex: 2024"
                  required
                />
              </div>
              <div>
                <Label htmlFor="price">Prix (€)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  placeholder="Ex: 18900"
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Numéro de téléphone</Label>
                <Input
                  id="phone"
                  name="phone_number"
                  placeholder="Ex: +33 6 65 64 72 03"
                  required
                />
              </div>
              <div>
                <Label htmlFor="condition">Condition</Label>
                <select
                  id="condition"
                  name="condition"
                  className="w-full p-2 border rounded-md"
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
                  placeholder="Ex: 0"
                  required
                />
              </div>
              <div>
                <Label htmlFor="category">Catégorie</Label>
                <select
                  id="category"
                  name="category"
                  className="w-full p-2 border rounded-md"
                  required
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                >
                  <option value="">Sélectionner une catégorie</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                  <option value="new">+ Ajouter une nouvelle catégorie</option>
                </select>

                {selectedCategory === "new" && (
                  <div className="mt-2">
                    <Input
                      placeholder="Entrez le nom de la nouvelle catégorie"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      required
                    />
                  </div>
                )}
              </div>
              <div>
                <Label htmlFor="fuel_type">Type de carburant</Label>
                <select
                  id="fuel_type"
                  name="fuel_type"
                  className="w-full p-2 border rounded-md"
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
                placeholder="Description détaillée du véhicule..."
                className="min-h-[200px]"
                required
              />
            </div>

            <div>
              <Label htmlFor="images">Images</Label>
              <div className="mt-2 flex flex-col gap-4">
                {/* Image preview area */}
                {previewUrls.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {previewUrls.map((url, index) => (
                      <div
                        key={index}
                        className="relative h-40 rounded-lg overflow-hidden border"
                      >
                        <img
                          src={url || "/placeholder.svg"}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Upload area */}
                <div
                  className="flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10 cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="text-center">
                    <ImageIcon className="mx-auto h-12 w-12 text-gray-300" />
                    <div className="mt-4 flex text-sm leading-6 text-gray-600 justify-center">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer rounded-md bg-white font-semibold text-red-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-red-600 focus-within:ring-offset-2 hover:text-red-500"
                      >
                        <span>Télécharger des fichiers</span>
                        <input
                          id="file-upload"
                          ref={fileInputRef}
                          name="images"
                          type="file"
                          className="sr-only"
                          multiple
                          accept="image/*"
                          onChange={handleFileChange}
                        />
                      </label>
                      <p className="pl-1">ou glisser-déposer</p>
                    </div>
                    <p className="text-xs leading-5 text-gray-600">
                      PNG, JPG, GIF jusqu&apos;à 10MB
                    </p>
                    <p className="text-xs mt-2 text-gray-600">
                      {selectedFiles.length} fichier(s) sélectionné(s)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                variant="outline"
                type="button"
                onClick={() => router.back()}
                disabled={submitting}
              >
                Annuler
              </Button>
              <Button
                className="bg-red-600 hover:bg-red-700"
                type="submit"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Ajout en cours...
                  </>
                ) : (
                  "Ajouter le véhicule"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
