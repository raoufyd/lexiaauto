import Image from "next/image";
import Link from "next/link";
import type { Car } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

interface CarCardProps {
  car: Car;
}

export default function CarCard({ car }: CarCardProps) {
  // Get the first image or use a placeholder
  const imageUrl =
    car.images && car.images.length > 0
      ? car.images[0].url
      : `/placeholder.svg?height=200&width=300&text=${encodeURIComponent(
          car.brand + " " + car.model
        )}`;

  // Format price with commas
  const formattedPrice =
    typeof car.price === "number"
      ? car.price.toLocaleString("fr-FR")
      : car.price;

  return (
    <Link href={`/vehicles/${car.id}`}>
      <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
        <div className="relative h-64">
          <Image
            src={imageUrl || "/placeholder.svg"}
            alt={car.name}
            fill
            className="object-cover"
          />

          {car.stock_status === "disponible" && (
            <Badge className="absolute top-2 right-2 bg-green-500">
              Disponible
            </Badge>
          )}
          {car.stock_status === "non-disponible" && (
            <Badge className="absolute top-2 right-2 bg-red-500">
              non-disponible
            </Badge>
          )}
          {car.stock_status === "en arrivage" && (
            <Badge className="absolute top-2 right-2 bg-orange-500">
              En arrivage
            </Badge>
          )}
          {car.condition == "-3ans" ? (
            <Badge className="absolute top-2 left-2 bg-black">
              {car.mileage} Km
            </Badge>
          ) : (
            ""
          )}
        </div>
        <div className="p-4">
          <h3 className="font-bold text-lg mb-1 line-clamp-1">{car.name}</h3>
          <div className="flex items-center gap-2 mb-2">
            {car.condition === "new" && (
              <Badge className=" bg-green-500">Neuf</Badge>
            )}
            {car.condition === "-3ans" && (
              <Badge className=" bg-blue-500">-3 ans</Badge>
            )}
            <Badge variant="outline" className="text-xs">
              {car.year}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {car.transmission}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {car.fuel_type}
            </Badge>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <span className="text-xl font-semibold ">{formattedPrice}€ </span>
              <span>HT</span>
            </div>

            <span className="text-sm text-gray-500">LEXIA AUTO EXPORT</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
