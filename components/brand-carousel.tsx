"use client";

import Image from "next/image";
import Carousel from "@/components/carousel";
import { useEffect, useState } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";

interface CarBrand {
  name: string;
  logo: string;
}

interface BrandCarouselProps {
  brands: CarBrand[];
}

export default function BrandCarousel({ brands }: BrandCarouselProps) {
  const [slidesToShow, setSlidesToShow] = useState(4);
  const isMobile = useMediaQuery("(max-width: 640px)");
  const isTablet = useMediaQuery("(min-width: 641px) and (max-width: 1024px)");

  useEffect(() => {
    if (isMobile) {
      setSlidesToShow(2);
    } else if (isTablet) {
      setSlidesToShow(4);
    } else {
      setSlidesToShow(6);
    }
  }, [isMobile, isTablet]);

  // Group brands into slides based on slidesToShow
  const groupedBrands = [];
  for (let i = 0; i < brands.length; i += slidesToShow) {
    groupedBrands.push(brands.slice(i, i + slidesToShow));
  }

  return (
    <Carousel
      autoSlideInterval={2500}
      className="w-full py-4"
      showArrows={false}
    >
      {groupedBrands.map((group, groupIndex) => (
        <div key={groupIndex} className="w-full px-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-6 justify-items-center">
            {group.map((brand) => (
              <div key={brand.name} className="flex flex-col items-center">
                <div className="bg-white p-4 rounded-full shadow-md hover:shadow-lg transition-shadow duration-300 mb-2">
                  <Image
                    src={brand.logo || "/placeholder.svg"}
                    alt={`Logo ${brand.name}`}
                    width={60}
                    height={60}
                    className="object-contain"
                  />
                </div>
                <span className="text-sm font-medium">{brand.name}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </Carousel>
  );
}
