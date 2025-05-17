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
          <p>{notification.message}</p>
          <button 
            onClick={() => setNotification({ show: false, message: "", type: "" })}
            className="ml-3 text-gray-500 hover:text-gray-700"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
      )}
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center">
            <ShoppingCartIcon className="h-8 w-8 mr-3 text-blue-600" />
            Carrito de compras
          </h1>
          <span className="text-gray-500">
            {books.length} {books.length === 1 ? "artículo" : "artículos"}
          </span>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            <p className="ml-3 text-lg font-medium text-gray-600">Cargando carrito...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
            <div className="flex">
              <ExclamationCircleIcon className="h-6 w-6 text-red-500 mr-3" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        ) : books.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg shadow-sm">
            <ShoppingBagIcon className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">Tu carrito está vacío</h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              Parece que aún no has añadido ningún libro a tu carrito. Explora nuestra biblioteca para encontrar tus próximas lecturas favoritas.
            </p>
            <button
              onClick={() => navigate("/")}
              className="inline-flex items-center px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm"
            >
              <BookOpenIcon className="h-5 w-5 mr-2" />
              Explorar libros
            </button>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Lista de productos */}
            <div className="lg:w-2/3">
              <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
                <div className="divide-y divide-gray-200">
                  {books.map((book) => (
                    <div key={book.book_id} className="p-6">
                      <div className="flex gap-6">
                        {/* Imagen del libro */}
                        <div className="h-48 w-32 flex-shrink-0">
                          <img
                            src={book.cover || "/placeholder.svg"}
                            alt={book.title}
                            className="h-full w-full object-cover rounded-lg shadow-sm"
                          />
                        </div>
                        
                        {/* Detalles del libro */}
                        <div className="flex-1 flex flex-col">
                          <div className="flex justify-between">
                            <div>
                              <h3 className="font-semibold text-lg text-gray-800">{book.title}</h3>
                              <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                                {book.synopsis}
                              </p>
                              
                              {/* Stock disponible (opcional) */}
                              {book.stock && (
                                <p className="text-sm text-gray-500 mt-2">
                                  {book.stock > 5 
                                    ? "Disponible" 
                                    : `¡Solo quedan ${book.stock} unidades!`}
                                </p>
                              )}
                            </div>
                            <p className="font-bold text-lg text-gray-800">
                              ${book.price.toFixed(2)}
                            </p>
                          </div>
                          
                          {/* Acciones del producto */}
                          <div className="mt-auto pt-4 flex items-center justify-between">
                            <div className="flex items-center space-x-1">
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
                              <p className="font-semibold text-lg mr-4">
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
                className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
              >
                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                Continuar comprando
              </button>
            </div>
            
            {/* Resumen de compra */}
            <div className="lg:w-1/3">
              <div className="bg-white rounded-xl shadow-sm overflow-hidden sticky top-4">
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-6">Resumen de compra</h2>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal ({books.length} {books.length === 1 ? "artículo" : "artículos"})</span>
                      <span className="font-medium">${calculateSubtotal().toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">IVA (16%)</span>
                      <span className="font-medium">${calculateTax().toFixed(2)}</span>
                    </div>
                    
                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex justify-between">
                        <span className="text-gray-800 font-bold">Total</span>
                        <span className="text-blue-600 font-bold text-xl">${calculateTotal().toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleCheckout}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
                  >
                    <ShoppingBagIcon className="h-5 w-5 mr-2" />
                    Proceder al pago
                  </button>
                  
                  {/* Métodos de pago aceptados */}
                  <div className="mt-6">
                    <p className="text-xs text-gray-500 mb-2 text-center">Aceptamos los siguientes métodos de pago</p>
                    <div className="flex justify-center space-x-2">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" alt="Visa" className="h-6" />
                      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" alt="Mastercard" className="h-6" />
                      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/American_Express_logo.svg/1200px-American_Express_logo.svg.png" alt="American Express" className="h-6" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ShoppingCart;