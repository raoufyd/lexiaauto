-- Create cars table
CREATE TABLE IF NOT EXISTS public.cars (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  price INTEGER NOT NULL,
  description TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  condition TEXT NOT NULL,
  mileage INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  category TEXT DEFAULT 'Sedan',
  fuel_type TEXT DEFAULT 'Diesel',
  transmission TEXT DEFAULT 'Manuelle'
);

-- Create car_images table
CREATE TABLE IF NOT EXISTS public.car_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  car_id UUID NOT NULL REFERENCES public.cars(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS car_images_car_id_idx ON public.car_images(car_id);

-- Sample car data (uncomment to insert)
-- INSERT INTO public.cars (name, brand, model, year, price, description, phone_number, condition, mileage, category, fuel_type, transmission)
-- VALUES 
--   ('CITROËN BERLINGO UTILITAIRE 1.6 HDI', 'CITROËN', 'BERLINGO', 2024, 18900, 'Véhicule neuf disponible pour export vers l''Algérie.', '+33 6 65 64 72 03', 'new', 0, 'Utilitaire', 'Diesel', 'Manuelle'),
--   ('PEUGEOT RIFTER GT LINE', 'PEUGEOT', 'RIFTER GT LINE', 2024, 19500, 'Véhicule neuf disponible pour export vers l''Algérie.', '+33 6 65 64 72 03', 'new', 0, 'Familiale', 'Diesel', 'Manuelle');
