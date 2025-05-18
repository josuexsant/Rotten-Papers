import { Navbar } from "../components/Navbar";
import { useState, useEffect } from "react";
import {
  ShoppingBagIcon,
  ArrowLeftIcon,
  PlusIcon,
  MinusIcon,
  TrashIcon,
  ShoppingCartIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  XMarkIcon,
  BookOpenIcon
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { getCartBooks, addToCart, removeFromCart } from "../api/api";

export function ShoppingCart() {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });

  // Calcular subtotal
  const calculateSubtotal = () => {
    return books.reduce((total, book) => total + book.price * (book.quantity || 1), 0);
  };

  // Calcular impuestos (ejemplo: 16% IVA)
  const calculateTax = () => {
    return calculateSubtotal() * 0.16;
  };

  // Calcular total
  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  // Mostrar notificación
  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 3000);
  };

  // Obtener libros del carrito al cargar el componente
  useEffect(() => {
    const fetchCart = async () => {
      try {
        setLoading(true);
        const response = await getCartBooks();
        
        // Inicializar cada libro con quantity: 1
        const booksWithQuantity = response.data.map((book) => ({
          ...book,
          quantity: 1,
        }));
        
        setBooks(booksWithQuantity);
      } catch (err) {
        setError("Error al cargar el carrito. Inténtalo de nuevo.");
        if (err.response?.status === 401) {
          localStorage.removeItem("authToken");
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [navigate]);

  // Eliminar libro del carrito
  const handleRemoveFromCart = async (bookId) => {
    try {
      await removeFromCart(bookId);
      const updatedCart = await getCartBooks();
      
      // Reestablecer quantity: 1 para los libros del carrito
      const booksWithQuantity = updatedCart.data.map((book) => ({
        ...book,
        quantity: 1,
      }));
      
      setBooks(booksWithQuantity);
      showNotification("Libro eliminado del carrito", "success");
    } catch (err) {
      showNotification(err.response?.data?.message || "Error al eliminar el libro.", "error");
    }
  };

  // Actualizar cantidad de un libro
  const updateQuantity = (bookId, change) => {
    setBooks(
      books.map((book) => {
        if (book.book_id === bookId) {
          const newQuantity = Math.max(1, (book.quantity || 1) + change);
          return { ...book, quantity: newQuantity };
        }
        return book;
      })
    );
  };

  // Proceder al pago
  const handleCheckout = () => {
    if (books.length === 0) {
      showNotification("El carrito está vacío", "error");
    } else {
      navigate("/payment");
    }
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
          <p className="text-sm">{notification.message}</p>
          <button 
            onClick={() => setNotification({ show: false, message: "", type: "" })}
            className="ml-3 text-gray-500 hover:text-gray-700"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
      )}
      
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <div className="flex flex-wrap items-center justify-between mb-4 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center mb-2 sm:mb-0">
            <ShoppingCartIcon className="h-6 w-6 sm:h-8 sm:w-8 mr-2 sm:mr-3 text-blue-600" />
            Carrito de compras
          </h1>
          <span className="text-gray-500">
            {books.length} {books.length === 1 ? "artículo" : "artículos"}
          </span>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
            <p className="ml-3 text-base sm:text-lg font-medium text-gray-600">Cargando carrito...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
            <div className="flex">
              <ExclamationCircleIcon className="h-6 w-6 text-red-500 mr-3 flex-shrink-0" />
              <p className="text-red-700 text-sm sm:text-base">{error}</p>
            </div>
          </div>
        ) : books.length === 0 ? (
          <div className="text-center py-12 sm:py-20 bg-white rounded-lg shadow-sm">
            <ShoppingBagIcon className="h-12 w-12 sm:h-16 sm:w-16 mx-auto text-gray-400 mb-4" />
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-2">Tu carrito está vacío</h2>
            <p className="text-gray-500 mb-6 sm:mb-8 max-w-md mx-auto px-4 text-sm sm:text-base">
              Parece que aún no has añadido ningún libro a tu carrito. Explora nuestra biblioteca para encontrar tus próximas lecturas favoritas.
            </p>
            <button
              onClick={() => navigate("/")}
              className="inline-flex items-center px-4 sm:px-5 py-2 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm text-sm sm:text-base"
            >
              <BookOpenIcon className="h-5 w-5 mr-2" />
              Explorar libros
            </button>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-8">
            {/* Lista de productos */}
            <div className="lg:w-2/3">
              <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-4 sm:mb-6">
                <div className="divide-y divide-gray-200">
                  {books.map((book) => (
                    <div key={book.book_id} className="p-3 sm:p-6">
                      <div className="flex flex-col sm:flex-row gap-3 sm:gap-6">
                        {/* Imagen del libro */}
                        <div className="h-36 w-24 sm:h-48 sm:w-32 flex-shrink-0 mx-auto sm:mx-0">
                          <img
                            src={book.cover || "/placeholder.svg"}
                            alt={book.title}
                            className="h-full w-full object-cover rounded-lg shadow-sm"
                          />
                        </div>
                        
                        {/* Detalles del libro */}
                        <div className="flex-1 flex flex-col">
                          <div className="flex flex-col sm:flex-row sm:justify-between">
                            <div>
                              <h3 className="font-semibold text-base sm:text-lg text-gray-800 text-center sm:text-left">{book.title}</h3>
                              <p className="text-gray-500 text-xs sm:text-sm mt-1 line-clamp-2 text-center sm:text-left">
                                {book.synopsis}
                              </p>
                              
                              {/* Stock disponible (opcional) */}
                              {book.stock && (
                                <p className="text-xs sm:text-sm text-gray-500 mt-2 text-center sm:text-left">
                                  {book.stock > 5 
                                    ? "Disponible" 
                                    : `¡Solo quedan ${book.stock} unidades!`}
                                </p>
                              )}
                            </div>
                            <p className="font-bold text-base sm:text-lg text-gray-800 mt-2 sm:mt-0 text-center sm:text-right">
                              ${book.price.toFixed(2)}
                            </p>
                          </div>
                          
                          {/* Acciones del producto */}
                          <div className="mt-3 sm:mt-auto pt-2 sm:pt-4 flex flex-col sm:flex-row items-center justify-between">
                            <div className="flex items-center space-x-1 mb-3 sm:mb-0">
                              <button
                                onClick={() => updateQuantity(book.book_id, -1)}
                                className="h-8 w-8 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100 transition-colors"
                                aria-label="Disminuir cantidad"
                              >
                                <MinusIcon className="h-4 w-4" />
                              </button>
                              
                              <div className="w-10 text-center">
                                <span className="font-medium">{book.quantity || 1}</span>
                              </div>
                              
                              <button
                                onClick={() => updateQuantity(book.book_id, 1)}
                                className="h-8 w-8 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100 transition-colors"
                                aria-label="Aumentar cantidad"
                              >
                                <PlusIcon className="h-4 w-4" />
                              </button>
                            </div>
                            
                            <div className="flex items-center">
                              <p className="font-semibold text-base sm:text-lg mr-4">
                                ${(book.price * (book.quantity || 1)).toFixed(2)}
                              </p>
                              <button
                                onClick={() => handleRemoveFromCart(book.book_id)}
                                className="text-gray-500 hover:text-red-600 transition-colors focus:outline-none"
                                aria-label="Eliminar producto"
                              >
                                <TrashIcon className="h-5 w-5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <button
                onClick={() => navigate("/")}
                className="flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm sm:text-base mb-4 sm:mb-0"
              >
                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                Continuar comprando
              </button>
            </div>
            
            {/* Resumen de compra - Versión móvil: sticky en parte inferior, Desktop: lateral */}
            <div className="lg:w-1/3">
              <div className="bg-white rounded-xl shadow-sm overflow-hidden lg:sticky lg:top-4">
                <div className="p-4 sm:p-6">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6">Resumen de compra</h2>
                  
                  <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                    <div className="flex justify-between">
                      <span className="text-sm sm:text-base text-gray-600">Subtotal ({books.length} {books.length === 1 ? "artículo" : "artículos"})</span>
                      <span className="font-medium text-sm sm:text-base">${calculateSubtotal().toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-sm sm:text-base text-gray-600">IVA (16%)</span>
                      <span className="font-medium text-sm sm:text-base">${calculateTax().toFixed(2)}</span>
                    </div>
                    
                    <div className="pt-3 sm:pt-4 border-t border-gray-200">
                      <div className="flex justify-between">
                        <span className="text-gray-800 font-bold text-sm sm:text-base">Total</span>
                        <span className="text-blue-600 font-bold text-lg sm:text-xl">${calculateTotal().toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleCheckout}
                    className="w-full bg-blue-600 text-white py-2 sm:py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center text-sm sm:text-base"
                  >
                    <ShoppingBagIcon className="h-5 w-5 mr-2" />
                    Proceder al pago
                  </button>
                  
                  {/* Métodos de pago aceptados */}
                  <div className="mt-4 sm:mt-6">
                    <p className="text-xs text-gray-500 mb-2 text-center">Aceptamos los siguientes métodos de pago</p>
                    <div className="flex justify-center space-x-2">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" alt="Visa" className="h-4 sm:h-6" />
                      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" alt="Mastercard" className="h-4 sm:h-6" />
                      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/American_Express_logo.svg/1200px-American_Express_logo.svg.png" alt="American Express" className="h-4 sm:h-6" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Barra de navegación inferior para móviles con resumen y botón de pago */}
      {!loading && !error && books.length > 0 && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 p-3 z-10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600">Total:</p>
              <p className="font-bold text-blue-600 text-lg">${calculateTotal().toFixed(2)}</p>
            </div>
            <button
              onClick={handleCheckout}
              className="bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center text-sm"
            >
              <ShoppingBagIcon className="h-4 w-4 mr-2" />
              Proceder al pago
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ShoppingCart;