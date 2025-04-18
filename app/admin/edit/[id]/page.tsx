"use client";

import type React from "react";

import { useState, useEffect, useRef, use } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  getCarById,
  getCarBrands,
  getCarCategories,
  deleteCarImage,
} from "@/lib/actions";
import { updateCar } from "@/lib/actions";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Loader2,
  AlertCircle,
  X,
  ImageIcon,
  Star,
  Trash2,
  Plus,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@radix-ui/react-alert-dialog";
import {
  AlertDialogFooter,
  AlertDialogHeader,
} from "@/components/ui/alert-dialog";
import { commonCarColors } from "@/lib/colors";

export default function EditCarPage({ params }: { params: { id: string } }) {
  const [car, setCar] = useState<any>(null);
  const [brands, setBrands] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [newBrand, setNewBrand] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<any[]>([]);
  const [mainImageId, setMainImageId] = useState<string | null>(null);
  const [mainImageIndex, setMainImageIndex] = useState<number>(-1);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [newColor, setNewColor] = useState("");
  const colorInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const { id } = use(params);

  // Options de stock
  const stockOptions = [
    { value: "disponible", label: "Disponible" },
    { value: "non-disponible", label: "Non disponible" },
    { value: "en-arrivage", label: "En arrivage" },
  ];

  const router = useRouter();

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

        // Initialiser les couleurs disponibles si elles n'existent pas
        if (!carData.available_colors) {
          carData.available_colors = [];
        }

        // Initialiser le stock s'il n'existe pas
        if (!carData.stock) {
          carData.stock = "disponible";
        }
        setCar(carData);
        setBrands(brandsData);
        setCategories(categoriesData);
        setSelectedBrand(carData.brand);
        setSelectedCategory(carData.category);

        // Set existing images
        if (carData.images && carData.images.length > 0) {
          setExistingImages(carData.images);

          // Find main image if it exists
          const mainImage = carData.images.find((img: any) => img.is_main);
          if (mainImage) {
            setMainImageId(mainImage.id);
          } else {
            // If no main image is set, use the first one
            setMainImageId(carData.images[0].id);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Erreur lors du chargement des données");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

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

  // Remove a selected file (new uploads)
  const removeFile = (index: number) => {
    // Create new arrays without the removed file
    const newSelectedFiles = [...selectedFiles];
    const newPreviewUrls = [...previewUrls];

    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(newPreviewUrls[index]);

    // Remove the file and its preview
    newSelectedFiles.splice(index, 1);
    newPreviewUrls.splice(index, 1);

    setSelectedFiles(newSelectedFiles);
    setPreviewUrls(newPreviewUrls);

    // Update main image index if needed
    if (index === mainImageIndex) {
      setMainImageIndex(-1);
    } else if (index < mainImageIndex) {
      // If we're removing an image before the main image, decrement the main image index
      setMainImageIndex(mainImageIndex - 1);
    }
  };

  // Modifiez la fonction removeExistingImage pour utiliser notre nouvelle fonction deleteCarImage

  const removeExistingImage = async (imageId: string) => {
    try {
      // Appeler la fonction pour supprimer l'image
      const result = await deleteCarImage(imageId);

      if (result.success) {
        // Mettre à jour l'état local pour refléter la suppression
        const newExistingImages = existingImages.filter(
          (img) => img.id !== imageId
        );
        setExistingImages(newExistingImages);

        // Si nous supprimons l'image principale, définir une nouvelle image principale
        if (imageId === mainImageId) {
          setMainImageId(
            newExistingImages.length > 0 ? newExistingImages[0].id : null
          );
        }

        // Afficher un message de succès
        setError(null);
      } else {
        // Afficher un message d'erreur
        setError(result.error || "Erreur lors de la suppression de l'image");
      }
    } catch (err: any) {
      console.error("Error removing image:", err);
      setError(
        err.message ||
          "Une erreur s'est produite lors de la suppression de l'image"
      );
    } finally {
      setLoading(false);
    }
  };

  // Set a new upload as the main image
  const setNewImageAsMain = (index: number) => {
    setMainImageIndex(index);
    setMainImageId(null);
  };

  // Set an existing image as the main image
  const setExistingImageAsMain = (imageId: string) => {
    setMainImageId(imageId);
    setMainImageIndex(-1);
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
  // Fonction pour ajouter une nouvelle couleur
  const addColor = () => {
    if (newColor.trim() === "") return;

    setCar((prev: any) => ({
      ...prev,
      available_colors: [...(prev.available_colors || []), newColor.trim()],
    }));
    setNewColor("");

    // Focus sur le champ d'entrée après l'ajout
    if (colorInputRef.current) {
      colorInputRef.current.focus();
    }
  };

  // Fonction pour supprimer une couleur
  const removeColor = (index: number) => {
    setCar((prev: any) => {
      const newColors = [...(prev.available_colors || [])];
      newColors.splice(index, 1);
      return {
        ...prev,
        available_colors: newColors,
      };
    });
  };

  // Fonction pour gérer la touche Entrée dans le champ de couleur
  const handleColorKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addColor();
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
      // Add available colors
      if (car.available_colors && car.available_colors.length > 0) {
        formData.set("available_colors", JSON.stringify(car.available_colors));
      } else {
        formData.set("available_colors", JSON.stringify([]));
      }
      // Add selected files to formData
      formData.delete("images");
      selectedFiles.forEach((file) => {
        formData.append("images", file);
      });

      // Add main image information
      if (mainImageId) {
        formData.set("main_image_id", mainImageId);
      } else if (mainImageIndex >= 0) {
        formData.set("main_image_index", mainImageIndex.toString());
      }

      // Add images to delete
      if (imagesToDelete.length > 0) {
        formData.set("images_to_delete", JSON.stringify(imagesToDelete));
      }

      const result = await updateCar(id, formData);

      if (result.error) {
        setError(result.error);
        if (result.error === "Not authenticated") {
          // If not authenticated, redirect to login
          router.push("/admin/login");
        }
        return;
      }

      // Success - redirect to admin page
      router.push(`/vehicles/${result.car.id}`);
    } catch (error: any) {
      console.error("Error updating car:", error);
      setError(error.message || "An error occurred while updating the car");
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
                <Input id="name" name="name" defaultValue={car.name} required />
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
              <div>
                <Label htmlFor="stock">Stock</Label>
                <select
                  id="stock"
                  name="stock"
                  className="w-full p-2 border rounded-md"
                  defaultValue={car.stock}
                  required
                >
                  {stockOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <Label htmlFor="available_colors">Couleurs disponibles</Label>
              <div className="mt-2 space-y-4">
                <div className="flex flex-wrap gap-2">
                  {car.available_colors && car.available_colors.length > 0 ? (
                    car.available_colors.map((color: string, index: number) => (
                      <Badge
                        key={index}
                        className="px-3 py-1 flex items-center gap-1"
                      >
                        {color}
                        <button
                          type="button"
                          onClick={() => removeColor(index)}
                          className="ml-1 text-xs hover:text-red-500"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">
                      Aucune couleur ajoutée
                    </p>
                  )}
                </div>
                {/* Liste de couleurs prédéfinies */}
                <div className="mt-2">
                  <p className="text-sm font-medium mb-2">
                    Couleurs communes :
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {commonCarColors.map((color) => (
                      <button
                        key={color.value}
                        type="button"
                        onClick={() => {
                          if (!car.available_colors?.includes(color.value)) {
                            setCar((prev: any) => ({
                              ...prev,
                              available_colors: [
                                ...(prev.available_colors || []),
                                color.value,
                              ],
                            }));
                          }
                        }}
                        className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-md text-sm"
                        disabled={car.available_colors?.includes(color.value)}
                      >
                        {color.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Ajout de couleur personnalisée */}
                <div className="flex gap-2 mt-4">
                  <Input
                    ref={colorInputRef}
                    placeholder="Ajouter une couleur"
                    value={newColor}
                    onChange={(e) => setNewColor(e.target.value)}
                    onKeyDown={handleColorKeyDown}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    onClick={addColor}
                    variant="outline"
                    className="flex items-center gap-1"
                    disabled={!newColor.trim()}
                  >
                    <Plus className="h-4 w-4" />
                    Ajouter
                  </Button>
                </div>
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

            <div>
              <div className="flex justify-between items-center mb-2">
                <Label>Images actuelles</Label>
                <p className="text-sm text-gray-500">
                  Cliquez sur l&apos;étoile pour définir l&apos;image principale
                </p>
              </div>

              {existingImages.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                  {existingImages.map((image: any) => (
                    <div
                      key={image.id}
                      className={`relative h-40 rounded-lg overflow-hidden ${
                        image.id === mainImageId
                          ? "border-2 border-red-600"
                          : "border border-gray-200"
                      }`}
                    >
                      <div className="w-full h-full relative">
                        <Image
                          src={image.url || "/placeholder.svg"}
                          alt={car.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 50vw, 25vw"
                          onError={(e) => {
                            // Fallback en cas d'erreur de chargement d'image
                            const target = e.target as HTMLImageElement;
                            target.src =
                              "/placeholder.svg?height=160&width=160&text=Image+Error";
                          }}
                        />
                      </div>
                      <div className="absolute top-2 right-2 flex space-x-1">
                        <button
                          type="button"
                          onClick={() => setExistingImageAsMain(image.id)}
                          className={`p-1 rounded-full ${
                            image.id === mainImageId
                              ? "bg-red-600 text-white"
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          }`}
                          title="Définir comme image principale"
                        >
                          <Star className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeExistingImage(image.id)}
                          className="bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                          title="Supprimer l'image"
                          disabled={loading}
                        >
                          {loading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      {image.id === mainImageId && (
                        <div className="absolute bottom-0 left-0 right-0 bg-red-600 text-white text-xs py-1 text-center">
                          Image principale
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-500 italic mb-4">
                  Aucune image disponible
                </div>
              )}

              <div className="mt-6">
                <div className="flex justify-between items-center mb-2">
                  <Label htmlFor="images">Ajouter des images</Label>
                  {previewUrls.length > 0 && (
                    <p className="text-sm text-gray-500">
                      Cliquez sur l&apos;étoile pour définir l&apos;image
                      principale
                    </p>
                  )}
                </div>
                <div className="mt-2 flex flex-col gap-4">
                  {/* Image preview area */}
                  {previewUrls.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {previewUrls.map((url, index) => (
                        <div
                          key={index}
                          className={`relative h-40 rounded-lg overflow-hidden border ${
                            index === mainImageIndex
                              ? "border-red-600 border-2"
                              : "border-gray-200"
                          }`}
                        >
                          <img
                            src={url || "/placeholder.svg"}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 right-2 flex space-x-1">
                            <button
                              type="button"
                              onClick={() => setNewImageAsMain(index)}
                              className={`p-1 rounded-full ${
                                index === mainImageIndex
                                  ? "bg-red-600 text-white"
                                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                              }`}
                              title="Définir comme image principale"
                            >
                              <Star className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => removeFile(index)}
                              className="bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                              title="Supprimer l'image"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                          {index === mainImageIndex && (
                            <div className="absolute bottom-0 left-0 right-0 bg-red-600 text-white text-xs py-1 text-center">
                              Image principale
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Upload area */}
                  <div
                    className="flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10 cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      fileInputRef.current?.click();
                    }}
                  >
                    <div className="text-center">
                      <ImageIcon className="mx-auto h-12 w-12 text-gray-300" />
                      <div className="mt-4 flex text-sm leading-6 text-gray-600 justify-center">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer rounded-md bg-white font-semibold text-red-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-red-600 focus-within:ring-offset-2 hover:text-red-500"
                          onClick={(e) => e.stopPropagation()}
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
                        {selectedFiles.length} nouveau(x) fichier(s)
                        sélectionné(s)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                variant="outline"
                type="button"
                onClick={() => setCancelDialogOpen(true)}
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
                    Mise à jour en cours...
                  </>
                ) : (
                  "Mettre à jour le véhicule"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
      {/* Dialogue de confirmation pour annuler les modifications */}
      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Annuler les modifications ?</AlertDialogTitle>
            <AlertDialogDescription>
              Vous avez des modifications non sauvegardées. Êtes-vous sûr de
              vouloir annuler ? Toutes les modifications seront perdues.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continuer l&apos;édition</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => router.back()}
              className="bg-red-600 hover:bg-red-700"
            >
              Annuler les modifications
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
