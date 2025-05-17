import { useEffect, useState } from "react";
import { Navbar } from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { host, addToCart } from "../api/api";
import { 
  HeartIcon, 
  ShoppingCartIcon, 
  TrashIcon, 
  MagnifyingGlassIcon, 
  EyeIcon, 
  ExclamationCircleIcon,
  CheckCircleIcon,
  XMarkIcon,
  BookOpenIcon
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid, StarIcon } from "@heroicons/react/24/solid";

export const Favorites = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });
  const [confirmDelete, setConfirmDelete] = useState(null);

  // Muestra una notificación temporal
  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 3000);
  };

  // Carga inicial de los libros favoritos
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${host}/favorites/`, {
          method: "GET",
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error("Error al cargar favoritos");
        }

        const data = await response.json();
        setBooks(data);
        setFilteredBooks(data);
      } catch (error) {
        console.error("Error:", error);
        setError(error.message || "Error al cargar favoritos");
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  // Maneja la eliminación de un libro de favoritos
  const handleRemove = async (bookId) => {
    try {
      const response = await fetch(`${host}/favorites/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ book_id: bookId }),
      });

      if (!response.ok) {
        throw new Error("Error al eliminar el libro");
      }

      const updatedBooks = books.filter((book) => book.book_id !== bookId);
      setBooks(updatedBooks);
      setFilteredBooks(updatedBooks.filter((book) =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase())
      ));
      showNotification("Libro eliminado de favoritos", "success");
    } catch (error) {
      console.error("Error:", error);
      showNotification("Error al eliminar el libro", "error");
    } finally {
      setConfirmDelete(null);
    }
  };

  // Maneja la búsqueda de libros
  const handleSearch = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    
    if (value === "") {
      setFilteredBooks(books);
    } else {
      const filtered = books.filter((book) =>
        book.title.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredBooks(filtered);
    }
  };

  // Añade un libro al carrito
  const handleAddToCart = async (bookId) => {
    try {
      const response = await addToCart(bookId);
      showNotification(response.data.message, "success");
    } catch (err) {
      showNotification(err.response?.data?.message || "Error al agregar el libro", "error");
    }
  };

  // Trunca texto para mostrarlo en un espacio limitado
  const truncateText = (text, maxLength) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Notificación */}
      {notification.show && (
        <div className={`fixed top-20 right-4 z-50 flex items-center p-4 rounded-lg shadow-lg ${
          notification.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
        }`}>
          {notification.type === "success" ? (
            <CheckCircleIcon className="h-6 w-6 mr-2" />
          ) : (
            <ExclamationCircleIcon className="h-6 w-6 mr-2" />
          )}
          <p>{notification.message}</p>
          <button 
            onClick={() => setNotification({ show: false, message: "", type: "" })}
            className="ml-3 text-gray-500 hover:text-gray-700"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
      )}
      
      {/* Modal de confirmación para eliminar */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
            <h3 className="text-lg font-medium text-gray-900 mb-4">¿Eliminar de favoritos?</h3>
            <p className="text-gray-600 mb-6">
              ¿Estás seguro de que quieres eliminar "{confirmDelete.title}" de tu lista de favoritos?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleRemove(confirmDelete.id)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Encabezado */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center justify-center">
            <HeartIconSolid className="h-8 w-8 mr-2 text-red-500" />
            Mis Favoritos
          </h1>
          <p className="mt-2 text-gray-600">
            Todos tus libros favoritos en un solo lugar
          </p>
        </div>

        {/* Barra de búsqueda */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar en tus favoritos..."
              value={searchTerm}
              onChange={handleSearch}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        {/* Contenido principal */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            <p className="ml-3 text-lg font-medium text-gray-600">Cargando favoritos...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg max-w-lg mx-auto">
            <div className="flex">
              <ExclamationCircleIcon className="h-6 w-6 text-red-500 mr-3" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm max-w-2xl mx-auto">
            {searchTerm ? (
              <>
                <MagnifyingGlassIcon className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h2 className="text-2xl font-semibold text-gray-700 mb-2">No se encontraron resultados</h2>
                <p className="text-gray-500 mb-6">
                  No encontramos libros que coincidan con "{searchTerm}" en tu lista de favoritos.
                </p>
                <button
                  onClick={() => setSearchTerm("")}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                >
                  Ver todos los favoritos
                </button>
              </>
            ) : (
              <>
                <HeartIcon className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h2 className="text-2xl font-semibold text-gray-700 mb-2">No tienes favoritos</h2>
                <p className="text-gray-500 mb-6">
                  Parece que aún no has añadido ningún libro a tus favoritos.
                </p>
                <button
                  onClick={() => navigate("/")}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                >
                  <BookOpenIcon className="h-5 w-5 mr-2" />
                  Explorar libros
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredBooks.map((book) => (
              <div
                key={book.book_id}
                className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-200 flex flex-col"
              >
                {/* Imagen de portada */}
                <div className="relative group h-64 overflow-hidden">
                  <img
                    src={book.cover}
                    alt={book.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-4">
                    <button
                      onClick={() => navigate(`/reviews/${book.book_id}`)}
                      className="bg-white/90 text-gray-900 font-medium py-2 px-4 rounded-lg flex items-center hover:bg-white transition-colors mb-2"
                    >
                      <EyeIcon className="h-5 w-5 mr-2" />
                      Ver detalles
                    </button>
                  </div>
                </div>
                
                {/* Información del libro */}
                <div className="p-4 flex-grow flex flex-col">
                  <h3 className="text-lg font-semibold text-gray-800 line-clamp-2 mb-1">
                    {book.title}
                  </h3>
                  
                  {/* Calificación */}
                  <div className="flex mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <StarIcon
                        key={star}
                        className={`h-5 w-5 ${star <= Math.round(book.rating) ? 'text-yellow-500' : 'text-gray-300'}`}
                      />
                    ))}
                    <span className="ml-1 text-sm text-gray-600">
                      ({book.rating.toFixed(1)})
                    </span>
                  </div>
                  
                  {/* Sinopsis corta */}
                  {book.synopsis && (
                    <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                      {truncateText(book.synopsis, 100)}
                    </p>
                  )}

                  {/* Precio */}
                  <div className="mt-auto">
                    {book.price && (
                      <p className="text-lg font-bold text-gray-800 mb-3">
                        ${book.price.toFixed(2)}
                      </p>
                    )}
                    
                    {/* Botones de acción */}
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => handleAddToCart(book.book_id)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center transition-colors"
                      >
                        <ShoppingCartIcon className="h-5 w-5 mr-2" />
                        Agregar al carrito
                      </button>
                      
                      <button
                        onClick={() => setConfirmDelete({ id: book.book_id, title: book.title })}
                        className="w-full text-gray-600 hover:text-red-600 font-medium py-2 px-4 rounded-lg flex items-center justify-center transition-colors border border-gray-300 hover:border-red-300"
                      >
                        <TrashIcon className="h-5 w-5 mr-2" />
                        Eliminar de favoritos
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;