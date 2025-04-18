"use server";

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import type { Car } from "@/lib/types";
import { revalidatePath } from "next/cache";

// Create a server-side Supabase client
async function createServerSupabaseClient() {
  const cookieStore = cookies();
  return createServerComponentClient({ cookies: () => cookieStore });
}

export async function getCars() {
  const supabase = await createServerSupabaseClient();
  const { data: cars, error } = await supabase
    .from("cars")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching cars:", error);
    return [];
  }

  // Fetch images for each car
  const carsWithImages = await Promise.all(
    cars.map(async (car) => {
      const { data: images, error: imagesError } = await supabase
        .from("car_images")
        .select("*")
        .eq("car_id", car.id);

      if (imagesError) {
        console.error("Error fetching car images:", imagesError);
        return { ...car, images: [] };
      }

      return {
        ...car,
        images: images || [],
        // Add stock status based on condition
        stock: "DISPONIBLE IMMÉDIATEMENT",
      };
    })
  );

  return carsWithImages as Car[];
}

// Other functions remain the same...

export async function createCar(formData: FormData) {
  try {
    // Check authentication
    const supabase = await createServerSupabaseClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return { error: "Not authenticated", car: null };
    }

    // Extract car data from form
    const carData = {
      name: formData.get("name") as string,
      brand: formData.get("brand") as string,
      model: formData.get("model") as string,
      year: Number.parseInt(formData.get("year") as string),
      price: Number.parseInt(formData.get("price") as string),
      description: formData.get("description") as string,
      phone_number: formData.get("phone_number") as string, // Make sure this matches your form field name
      condition: formData.get("condition") as string,
      mileage: Number.parseInt(formData.get("mileage") as string),
      category: formData.get("category") as string,
      fuel_type: formData.get("fuel_type") as string,
      transmission: formData.get("transmission") as string,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      stock_status: (formData.get("stock") as string) || "disponible",
      available_colors: formData.get("available_colors")
        ? JSON.parse(formData.get("available_colors") as string)
        : [],
    };

    // Insert car data
    const { data: car, error } = await supabase
      .from("cars")
      .insert(carData)
      .select()
      .single();

    if (error) {
      console.error("Error creating car:", error);
      return { error: error.message, car: null };
    }

    // Handle image uploads if provided
    const imageFiles = formData.getAll("images") as File[];

    if (imageFiles && imageFiles.length > 0 && imageFiles[0].size > 0) {
      for (const file of imageFiles) {
        const fileExt = file.name.split(".").pop();
        const fileName = `${car.id}/${Date.now()}-${Math.random()
          .toString(36)
          .substring(2, 15)}.${fileExt}`;

        // Upload to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from("car-images")
          .upload(fileName, file);

        if (uploadError) {
          console.error("Error uploading image:", uploadError);
          continue;
        }

        // Get public URL
        const { data: publicUrlData } = supabase.storage
          .from("car-images")
          .getPublicUrl(fileName);

        // Add to car_images table
        await supabase.from("car_images").insert({
          car_id: car.id,
          url: publicUrlData.publicUrl,
        });
      }
    }

    revalidatePath("/vehicles");
    revalidatePath("/admin");
    revalidatePath(`/admin/cars/${car.id}`);

    return { car, error: null };
  } catch (error: any) {
    console.error("Unexpected error creating car:", error);
    return {
      error: error.message || "An unexpected error occurred",
      car: null,
    };
  }
}

export async function updateCar(id: string, formData: FormData) {
  try {
    // Check authentication
    const supabase = await createServerSupabaseClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return { error: "Not authenticated", car: null };
    }

    // Extract car data from form
    const carData = {
      name: formData.get("name") as string,
      brand: formData.get("brand") as string,
      model: formData.get("model") as string,
      year: Number.parseInt(formData.get("year") as string),
      price: Number.parseInt(formData.get("price") as string),
      description: formData.get("description") as string,
      phone_number: formData.get("phone_number") as string, // Make sure this matches your form field name
      condition: formData.get("condition") as string,
      mileage: Number.parseInt(formData.get("mileage") as string),
      category: formData.get("category") as string,
      fuel_type: formData.get("fuel_type") as string,
      transmission: formData.get("transmission") as string,
      updated_at: new Date().toISOString(),
      stock_status: (formData.get("stock") as string) || "disponible",
      available_colors: formData.get("available_colors")
        ? JSON.parse(formData.get("available_colors") as string)
        : [],
    };

    // Update car data
    const { data: car, error } = await supabase
      .from("cars")
      .update(carData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating car:", error);
      return { error: error.message, car: null };
    }

    // Handle image uploads if provided
    const imageFiles = formData.getAll("images") as File[];

    if (imageFiles && imageFiles.length > 0 && imageFiles[0].size > 0) {
      for (const file of imageFiles) {
        const fileExt = file.name.split(".").pop();
        const fileName = `${car.id}/${Date.now()}-${Math.random()
          .toString(36)
          .substring(2, 15)}.${fileExt}`;

        // Upload to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from("car-images")
          .upload(fileName, file);

        if (uploadError) {
          console.error("Error uploading image:", uploadError);
          continue;
        }

        // Get public URL
        const { data: publicUrlData } = supabase.storage
          .from("car-images")
          .getPublicUrl(fileName);

        // Add to car_images table
        await supabase.from("car_images").insert({
          car_id: car.id,
          url: publicUrlData.publicUrl,
        });
      }
    }

    revalidatePath(`/vehicles/${id}`);
    revalidatePath("/vehicles");
    revalidatePath("/admin");
    revalidatePath(`/admin/cars/${id}`);

    return { car, error: null };
  } catch (error: any) {
    console.error("Unexpected error updating car:", error);
    return {
      error: error.message || "An unexpected error occurred",
      car: null,
    };
  }
}

export async function deleteCar(id: string) {
  try {
    // Check authentication
    const supabase = await createServerSupabaseClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return { error: "Not authenticated", success: false };
    }

    // Get car images
    const { data: images } = await supabase
      .from("car_images")
      .select("*")
      .eq("car_id", id);

    // Delete images from storage if they exist
    if (images && images.length > 0) {
      for (const image of images) {
        // Extract the path from the URL
        const urlParts = image.url.split("/");
        const bucketIndex = urlParts.findIndex((part) => part === "car-images");

        if (bucketIndex !== -1 && bucketIndex < urlParts.length - 1) {
          const path = urlParts.slice(bucketIndex + 1).join("/");

          // Delete from storage
          const { error: storageError } = await supabase.storage
            .from("car-images")
            .remove([path]);

          if (storageError) {
            console.error("Error deleting image from storage:", storageError);
          }
        }
      }
    }

    // Delete car images from database
    const { error: imagesError } = await supabase
      .from("car_images")
      .delete()
      .eq("car_id", id);

    if (imagesError) {
      console.error("Error deleting car images:", imagesError);
      return { error: "Failed to delete car images", success: false };
    }

    // Delete the car
    const { error } = await supabase.from("cars").delete().eq("id", id);

    if (error) {
      console.error("Error deleting car:", error);
      return { error: "Failed to delete car", success: false };
    }

    revalidatePath("/vehicles");
    revalidatePath("/admin");

    return { error: null, success: true };
  } catch (error: any) {
    console.error("Unexpected error during car deletion:", error);
    return {
      error: error.message || "An unexpected error occurred",
      success: false,
    };
  }
}
// Add these functions after the deleteCar function

export async function getCarBrands() {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("cars")
    .select("brand")
    .order("brand");

  if (error) {
    console.error("Error fetching car brands:", error);
    return [];
  }

  // Get unique brands
  const brands = [...new Set(data.map((car) => car.brand))];
  return brands;
}

export async function getCarCategories() {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("cars")
    .select("category")
    .order("category");

  if (error) {
    console.error("Error fetching car categories:", error);
    return [];
  }

  // Get unique categories
  const categories = [...new Set(data.map((car) => car.category))];
  return categories;
}
export async function getCarById(id: string) {
  const supabase = await createServerSupabaseClient();

  // Get the car data
  const { data: car, error } = await supabase
    .from("cars")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching car:", error);
    return null;
  }

  // Get the car images
  const { data: images, error: imagesError } = await supabase
    .from("car_images")
    .select("*")
    .eq("car_id", id);

  if (imagesError) {
    console.error("Error fetching car images:", imagesError);
    return { ...car, images: [] };
  }

  return {
    ...car,
    images: images || [],
    stock: "DISPONIBLE IMMÉDIATEMENT",
  } as Car;
}

export async function deleteCarImage(imageId: string) {
  try {
    const supabase = await createServerSupabaseClient();

    // Vérifier l'authentification
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return { success: false, error: "Not authenticated" };
    }

    // Récupérer l'image pour obtenir l'URL avant de la supprimer
    const { data: image, error: fetchError } = await supabase
      .from("car_images")
      .select("*")
      .eq("id", imageId)
      .single();

    if (fetchError) {
      console.error("Error fetching image:", fetchError);
      return { success: false, error: fetchError.message };
    }

    // Supprimer l'image de la base de données
    const { error: deleteError } = await supabase
      .from("car_images")
      .delete()
      .eq("id", imageId);

    if (deleteError) {
      console.error("Error deleting image:", deleteError);
      return { success: false, error: deleteError.message };
    }

    // Si l'image existe dans le stockage, la supprimer également
    if (image && image.url) {
      // Extraire le chemin du fichier à partir de l'URL
      const urlParts = image.url.split("/");
      const bucketIndex = urlParts.findIndex((part) => part === "car-images");

      if (bucketIndex !== -1 && bucketIndex < urlParts.length - 1) {
        const path = urlParts.slice(bucketIndex + 1).join("/");

        // Supprimer du stockage
        const { error: storageError } = await supabase.storage
          .from("car-images")
          .remove([path]);

        if (storageError) {
          console.error("Error deleting image from storage:", storageError);
          // On continue même si la suppression du stockage échoue
        }
      }
    }

    return { success: true, error: null };
  } catch (error: any) {
    console.error("Unexpected error during image deletion:", error);
    return {
      success: false,
      error: error.message || "An unexpected error occurred",
    };
  }
}
