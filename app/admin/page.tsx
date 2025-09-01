"use client";

import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { Database } from "@/lib/database.types";
import {
  Loader2,
  PlusCircle,
  Trash2,
  Edit,
  AlertCircle,
  Eye,
  Search,
} from "lucide-react";
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
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function AdminPage() {
  const { user, signOut } = useAuth();
  const [cars, setCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [carToDelete, setCarToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const [messages, setMessages] = useState<any[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(true);
  // pagination states
  const [page, setPage] = useState(1);
  const pageSize = 5;
  const [searchComments, setSearchComments] = useState("");
  const [pageComments, setPageComments] = useState(1);
  const pageSizeComments = 5;
  // search state
  const [search, setSearch] = useState("");

  const supabase = createClientComponentClient<Database>();

  // 🔹 Filtrage côté client
  const filteredMessages = useMemo(() => {
    if (!searchComments.trim()) return messages;
    return messages.filter(
      (msg) =>
        msg.comment?.toLowerCase().includes(searchComments.toLowerCase()) ||
        msg.name?.toLowerCase().includes(searchComments.toLowerCase())
    );
  }, [messages, searchComments]);

  // 🔹 Pagination côté client
  const totalPagesComments = Math.ceil(
    filteredMessages.length / pageSizeComments
  );
  const paginatedMessages = useMemo(() => {
    const from = (pageComments - 1) * pageSizeComments;
    return filteredMessages.slice(from, from + pageSizeComments);
  }, [filteredMessages, pageComments]);

  // toggle message on home
  const toggleHomeMessage = async (id: string, current: boolean) => {
    console.log("current, id : ", current, id);
    try {
      const { error } = await supabase
        .from("comments")
        .update({ show_on_home: !current })
        .eq("id", id);
      if (error) throw error.message;

      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, show_on_home: !current } : m))
      );
    } catch (err: any) {
      console.error("Error updating message:", err);
      setError(err.message);
    }
  };
  useEffect(() => {
    async function fetchCars() {
      try {
        setLoading(true);

        const { data, error } = await supabase
          .from("cars")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;

        setCars(data || []);
      } catch (err: any) {
        console.error("Error fetching cars:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    async function fetchMessages() {
      try {
        setLoadingMessages(true);

        const { data, error } = await supabase
          .from("comments")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        setMessages(data || []);
      } catch (err: any) {
        console.error("Error fetching messages:", err);
        setError(err.message);
      } finally {
        setLoadingMessages(false);
      }
    }

    fetchMessages();
    fetchCars();
  }, [supabase]);

  // ✅ client-side filter
  const filteredCars = useMemo(() => {
    if (!search.trim()) return cars;
    return cars.filter(
      (car) =>
        car.name?.toLowerCase().includes(search.toLowerCase()) ||
        car.brand?.toLowerCase().includes(search.toLowerCase()) ||
        car.model?.toLowerCase().includes(search.toLowerCase())
    );
  }, [cars, search]);

  // ✅ client-side pagination
  const totalPages = Math.ceil(filteredCars.length / pageSize);
  const paginatedCars = useMemo(() => {
    const from = (page - 1) * pageSize;
    return filteredCars.slice(from, from + pageSize);
  }, [filteredCars, page]);

  const handleDeleteClick = (carId: string) => {
    setCarToDelete(carId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!carToDelete) return;

    setIsDeleting(true);
    try {
      await deleteCar(carToDelete);
      setCars(cars.filter((car) => car.id !== carToDelete));
      setDeleteDialogOpen(false);
    } catch (err: any) {
      console.error("Error deleting car:", err);
      setError(`Erreur lors de la suppression: ${err.message}`);
    } finally {
      setIsDeleting(false);
      setCarToDelete(null);
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Administration</h1>
        <div className="flex gap-4">
          <Button variant="outline" onClick={signOut}>
            Déconnexion
          </Button>
          <Button className="bg-red-600 hover:bg-red-700" asChild>
            <Link href="/admin/add">
              <PlusCircle className="mr-2 h-4 w-4" />
              Ajouter un véhicule
            </Link>
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold">Liste des véhicules</h2>
          <p className="text-sm text-gray-500">
            Connecté en tant que {user?.email}
          </p>
        </div>

        {paginatedCars.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            Aucun véhicule trouvé.
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              {/* Search bar */}
              <div className="my-6 flex items-center ">
                <Search className="h-5 w-5 text-gray-500" />
                <input
                  type="text"
                  placeholder="Rechercher par nom, marque ou modèle..."
                  value={search}
                  onChange={(e) => {
                    setPage(1); // reset to first page on search
                    setSearch(e.target.value);
                  }}
                  className="w-3/4 border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Véhicule
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Marque
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Modèle
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Année
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Prix
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedCars.map((car) => (
                    <tr key={car.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {car.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {car.brand}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {car.model}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {car.year}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {typeof car.price === "number"
                          ? car.price.toLocaleString("fr-FR")
                          : car.price}
                        €
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/vehicles/${car.id}`}>
                              <Eye className="h-4 w-4 mr-1" />
                              Voir
                            </Link>
                          </Button>
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/admin/edit/${car.id}`}>
                              <Edit className="h-4 w-4 mr-1" />
                              Modifier
                            </Link>
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteClick(car.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Supprimer
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-between items-center p-4 border-t">
              <Button
                variant="outline"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Précédent
              </Button>
              <span>
                Page {page} sur {totalPages}
              </span>
              <Button
                variant="outline"
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Suivant
              </Button>
            </div>
          </>
        )}
      </div>
      {/* Messages Section */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mt-10">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold">Messages</h2>
          <p className="text-sm text-gray-500">
            Gérez les messages visibles sur la page d’accueil
          </p>
        </div>

        {loadingMessages ? (
          <div className="p-6 flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-red-600" />
            <span className="ml-2">Chargement des messages...</span>
          </div>
        ) : messages.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            Aucun message trouvé.
          </div>
        ) : (
          <div className="overflow-x-auto">
            {/* 🔎 Barre de recherche */}
            <div className="my-6 flex items-center">
              <Search className="h-5 w-5 text-gray-500" />
              <input
                type="text"
                placeholder="Rechercher par auteur ou contenu..."
                value={searchComments}
                onChange={(e) => {
                  setPageComments(1); // reset à la page 1
                  setSearchComments(e.target.value);
                }}
                className="w-3/4 border rounded-md px-3 py-2 ml-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            {/* Tableau */}
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Message
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Auteur
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedMessages.map((msg) => (
                  <tr key={msg.id}>
                    <td className="px-6 py-4">{msg.comment}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {msg.name || "Anonyme"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(msg.created_at).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="px-6 py-4">
                      <Button
                        variant={msg.show_on_home ? "destructive" : "outline"}
                        size="sm"
                        onClick={() =>
                          toggleHomeMessage(msg.id, msg.show_on_home)
                        }
                      >
                        {msg.show_on_home
                          ? "Retirer de l'accueil"
                          : "Ajouter à l'accueil"}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex justify-between items-center p-4 border-t">
              <Button
                variant="outline"
                disabled={pageComments === 1}
                onClick={() => setPageComments((p) => p - 1)}
              >
                Précédent
              </Button>
              <span>
                Page {pageComments} sur {totalPagesComments}
              </span>
              <Button
                variant="outline"
                disabled={pageComments === totalPagesComments}
                onClick={() => setPageComments((p) => p + 1)}
              >
                Suivant
              </Button>
            </div>
          </div>
        )}
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
              onClick={handleConfirmDelete}
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
