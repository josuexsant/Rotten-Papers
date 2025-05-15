import { Navbar } from "../components/Navbar";
import { useState, useEffect } from "react";
import {
  ShoppingBagIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { getCartBooks, addToCart, removeFromCart } from "../api/api"; // Ajusta la ruta

// Calcular subtotal
const subtotal = (books) => books.reduce((total, book) => total + book.price, 0);

export function ShoppingCart() {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Obtener libros del carrito al cargar el componente
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await getCartBooks();
        setBooks(response.data);
        setLoading(false);
      } catch (err) {
        setError("Error al cargar el carrito. Inténtalo de nuevo.");
        setLoading(false);
        if (err.response?.status === 401) {
          localStorage.removeItem("authToken");
          navigate("/login");
        }
      }
    };

    fetchCart();
  }, [navigate]);

  // Eliminar libro del carrito
  const handleRemoveFromCart = async (bookId) => {
    try {
      const response = await removeFromCart(bookId);
      const updatedCart = await getCartBooks();
      setBooks(updatedCart.data);
      alert(response.data.message);
    } catch (err) {
      alert(err.response?.data?.message || "Error al eliminar el libro.");
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto">
        <Navbar />
        <p>Cargando carrito...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto">
        <Navbar />
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-2 mt-8">
          <ShoppingBagIcon className="h-8 w-8" />
          Carrito de compras
        </h1>

        <div className="overflow-hidden">
          <div className="p-6">
            {books.length === 0 ? (
              <p>Tu carrito está vacío.</p>
            ) : (
              books.map((book) => (
                <div key={book.book_id} className="mb-6">
                  <div className="flex gap-6">
                    <div className="relative h-[150px] w-[120px] overflow-hidden rounded-lg bg-gray-100 flex-shrink-0">
                      <img
                        src={book.cover || "/placeholder.svg"}
                        alt={book.title}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium text-lg">{book.title}</h3>
                          <p className="text-gray-500">{book.synopsis}</p>
                        </div>
                        <div className="flex gap-4">
                          <button
                            onClick={() => handleRemoveFromCart(book.book_id)}
                            className="text-red-500 font-semibold"
                          >
                            Eliminar
                          </button>
                          <button
                            onClick={() => navigate("/payment")}
                            className="font-semibold"
                          >
                            Comprar
                          </button>
                        </div>
                      </div>
                      <div className="flex justify-between items-end">
                        <div className="text-lg font-medium">
                          ${book.price.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                  {book.book_id !== books[books.length - 1].book_id && (
                    <hr className="mt-6" />
                  )}
                </div>
              ))
            )}
          </div>

          <div className="bg-gray-50 p-6 border-t border-gray-200 mb-16">
            <div className="flex justify-between lg:justify-end items-center mb-6 p-5">
              <span className="text-2xl font-medium p-5">Subtotal</span>
              <span className="text-2xl font-bold">
                ${subtotal(books).toFixed(2)}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-5">
              <button
                onClick={() => navigate("/")}
                className="gap-2 px-10 py-3 rounded-lg flex border-2 border-black hover:bg-black hover:text-white"
              >
                <ArrowLeftIcon className="h-6 w-6" />
                Continuar comprando
              </button>
              <button
                onClick={() => navigate("/payment")}
                className="flex bg-blue-600 text-white gap-2 px-10 py-3 rounded-lg hover:bg-blue-500 hover:border-blue-600"
              >
                <ShoppingBagIcon className="h-6 w-6" />
                Comprar ahora
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ShoppingCart;