export interface Car {
  id: string;
  name: string;
  brand: string;
  model: string;
  year: number | string;
  price: number | string;
  description: string;
  phone_number: string;
  condition: string;
  mileage: number;
  category: string;
  fuel_type: string;
  transmission: string;
  images: CarImage[];
  stock_status?: string;
  available_colors: string[];
  created_at?: string;
  updated_at?: string;
}

export interface CarImage {
  id: string;
  car_id: string;
  url: string;
  created_at?: string;
}
