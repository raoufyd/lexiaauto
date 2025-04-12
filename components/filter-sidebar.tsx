"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface FilterSidebarProps {
  brands: string[];
  categories: string[];
  fuelTypes: string[];
  transmissions: string[];
  conditions: string[];
  minPrice: number;
  maxPrice: number;
  selectedBrand?: string;
  selectedCategory?: string;
  selectedFuel?: string;
  selectedTransmission?: string;
  priceRange: number[];
  selectedCondition?: string;
  searchQuery?: string;
  sortOption?: string;
}

export default function FilterSidebar({
  brands,
  categories,
  fuelTypes,
  transmissions,
  conditions,
  minPrice,
  maxPrice,
  selectedBrand = "",
  selectedCategory = "",
  selectedFuel = "",
  selectedTransmission = "",
  selectedCondition = "",
  priceRange = [0, 100000],
  searchQuery = "",
  sortOption = "default",
}: FilterSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [brand, setBrand] = useState<string>(selectedBrand);
  const [category, setCategory] = useState<string>(selectedCategory);
  const [fuel, setFuel] = useState<string>(selectedFuel);
  const [transmission, setTransmission] =
    useState<string>(selectedTransmission);
  const [price, setPrice] = useState<number[]>(priceRange);
  const [query, setQuery] = useState<string>(searchQuery);
  const [sort, setSort] = useState<string>(sortOption);
  const [condition, setCondition] = useState<string>(selectedCondition);
  // Update state when props change (e.g., when URL params change)
  useEffect(() => {
    setBrand(selectedBrand);
    setCategory(selectedCategory);
    setCondition(selectedCondition);
    setFuel(selectedFuel);
    setTransmission(selectedTransmission);
    setPrice(priceRange);
    setQuery(searchQuery);
    setSort(sortOption);
  }, [
    selectedBrand,
    selectedCategory,
    selectedFuel,
    selectedTransmission,
    selectedCondition,
    priceRange,
    searchQuery,
    sortOption,
  ]);

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());

    // Update or remove parameters based on filter values
    if (brand) params.set("brand", brand);
    else params.delete("brand");

    if (category) params.set("category", category);
    else params.delete("category");

    if (fuel) params.set("fuel", fuel);
    else params.delete("fuel");

    if (transmission) params.set("transmission", transmission);
    else params.delete("transmission");

    if (price[0] !== minPrice) params.set("minPrice", price[0].toString());
    else params.delete("minPrice");

    if (price[1] !== maxPrice) params.set("maxPrice", price[1].toString());
    else params.delete("maxPrice");

    if (query) params.set("query", query);
    else params.delete("query");

    if (sort !== "default") params.set("sort", sort);
    else params.delete("sort");
    if (condition) params.set("condition", condition);
    else params.delete("condition");

    // Navigate to the new URL with filters
    router.push(`/vehicles?${params.toString()}`);
  };

  const resetFilters = () => {
    setBrand("");
    setCategory("");
    setFuel("");
    setTransmission("");
    setCondition("");
    setPrice([minPrice, maxPrice]);
    setQuery("");
    setSort("default");
    router.push("/vehicles");
  };

  const handleBrandChange = (brandName: string) => {
    setBrand(brand === brandName ? "" : brandName);
  };

  const handleCategoryChange = (categoryName: string) => {
    setCategory(category === categoryName ? "" : categoryName);
  };

  return (
    <div className="w-full lg:w-1/4 bg-white p-6 rounded-lg shadow-md h-fit">
      <div className="mb-6">
        <h3 className="font-bold uppercase text-sm mb-4">Condition</h3>
        <div className="space-y-2">
          {conditions.map((t) => (
            <div key={t} className="flex items-center">
              <Checkbox
                id={`condition-${t}`}
                checked={condition === t}
                onCheckedChange={() => setCondition(condition === t ? "" : t)}
              />
              <Label htmlFor={`condition-${t}`} className="ml-2">
                {t}
              </Label>
            </div>
          ))}
        </div>
      </div>
      <div className="mb-6">
        <h3 className="font-bold uppercase text-sm mb-4">Catégorie</h3>
        <div className="space-y-2">
          {categories.map((cat) => (
            <div key={cat} className="flex items-center">
              <Checkbox
                id={`category-${cat}`}
                checked={category === cat}
                onCheckedChange={() => handleCategoryChange(cat)}
              />
              <Label htmlFor={`category-${cat}`} className="ml-2">
                {cat}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-bold uppercase text-sm mb-4">Marque</h3>
        <div className="grid grid-cols-2 gap-2">
          {brands.map((b) => (
            <div key={b} className="flex items-center">
              <Checkbox
                id={`brand-${b}`}
                checked={brand === b}
                onCheckedChange={() => handleBrandChange(b)}
              />
              <Label htmlFor={`brand-${b}`} className="ml-2">
                {b}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-bold uppercase text-sm mb-4">Prix</h3>
        <div className="space-y-4">
          <Slider
            value={price}
            min={minPrice}
            max={maxPrice}
            step={1000}
            onValueChange={setPrice}
          />
          <div className="flex justify-between items-center">
            <Input
              type="number"
              value={price[0]}
              onChange={(e) =>
                setPrice([Number.parseInt(e.target.value), price[1]])
              }
              className="w-24 text-sm"
            />
            <span className="text-sm">à</span>
            <Input
              type="number"
              value={price[1]}
              onChange={(e) =>
                setPrice([price[0], Number.parseInt(e.target.value)])
              }
              className="w-24 text-sm"
            />
            <span className="text-sm">€</span>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-bold uppercase text-sm mb-4">Carburant</h3>
        <RadioGroup value={fuel} onValueChange={setFuel}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="" id="fuel-all" />
            <Label htmlFor="fuel-all">Tous</Label>
          </div>
          {fuelTypes.map((f) => (
            <div key={f} className="flex items-center space-x-2">
              <RadioGroupItem value={f} id={`fuel-${f}`} />
              <Label htmlFor={`fuel-${f}`}>{f}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div className="mb-6">
        <h3 className="font-bold uppercase text-sm mb-4">Transmission</h3>
        <div className="space-y-2">
          {transmissions.map((t) => (
            <div key={t} className="flex items-center">
              <Checkbox
                id={`transmission-${t}`}
                checked={transmission === t}
                onCheckedChange={() =>
                  setTransmission(transmission === t ? "" : t)
                }
              />
              <Label htmlFor={`transmission-${t}`} className="ml-2">
                {t}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-bold uppercase text-sm mb-4">Trier par</h3>
        <RadioGroup value={sort} onValueChange={setSort}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="default" id="sort-default" />
            <Label htmlFor="sort-default">Par défaut</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="price-asc" id="sort-price-asc" />
            <Label htmlFor="sort-price-asc">Prix: Croissant</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="price-desc" id="sort-price-desc" />
            <Label htmlFor="sort-price-desc">Prix: Décroissant</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="date-desc" id="sort-date-desc" />
            <Label htmlFor="sort-date-desc">Date: Plus récent</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="date-asc" id="sort-date-asc" />
            <Label htmlFor="sort-date-asc">Date: Plus ancien</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Button
          className="w-full bg-red-600 hover:bg-red-700"
          onClick={applyFilters}
        >
          Appliquer les filtres
        </Button>
        <Button className="w-full" variant="outline" onClick={resetFilters}>
          Réinitialiser
        </Button>
      </div>
    </div>
  );
}
