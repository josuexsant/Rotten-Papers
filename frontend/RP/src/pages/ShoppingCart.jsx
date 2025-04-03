import { Navbar } from "../components/Navbar";
import { useState } from "react";
import {
  ShoppingBagIcon,
  ArrowLeftIcon,
  MinusIcon,
  PlusIcon,
} from "@heroicons/react/24/outline"; //Icons

// Calculate subtotal
const subtotal = (books) =>
  books.reduce((total, book) => total + book.price * book.quantity, 0);
// Update book quantity
const updateQuantity = (id, change, books, setBooks) => {
  setBooks(
    books.map((book) => {
      if (book.id === id) {
        const newQuantity = Math.max(1, book.quantity + change);
        return { ...book, quantity: newQuantity };
      }
      return book;
    })
  );
};

export function ShoppingCart() {
  // State for books
  const [books, setBooks] = useState([
    {
      id: 1,
      title: "The Design of Everyday Things",
      author: "Don Norman",
      price: 19.99,
      image: "https://www.pixartprinting.it/blog/wp-content/uploads/2024/03/1-2.jpg?height=150&width=120",
      quantity: 1,
    },
    {
      id: 2,
      title: "Atomic Habits",
      author: "James Clear",
      price: 16.99,
      image: "https://www.pixartprinting.it/blog/wp-content/uploads/2024/03/1-2.jpg?height=150&width=120",
      quantity: 2,
    },
    {
      id: 3,
      title: "The Alchemist",
      author: "Paulo Coelho",
      price: 12.99,
      image: "https://www.pixartprinting.it/blog/wp-content/uploads/2024/03/1-2.jpg?height=150&width=120",
      quantity: 1,
    },
  ]);
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
            {books.map((book) => (
              <div key={book.id} className="mb-6">
                <div className="flex gap-6">
                  <div className="relative h-[150px] w-[120px] overflow-hidden rounded-lg bg-gray-100 flex-shrink-0">
                    <img
                      src={book.image || "/placeholder.svg"}
                      alt={book.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex justify-between items-center ">
                      <div>
                        <h3 className="font-medium text-lg">{book.title}</h3>
                        <p className="text-gray-500">{book.author}</p>
                      </div>
                      <div className="flex gap-4">
                        <button className=" text-red-500 font-semibold">Eliminar</button>
                        <button className="font-semibold">Comprar</button>
                      </div>
                    </div>
                    <div className="flex justify-between items-end">
                      <div className="flex items-center gap-3 mt-2">
                        <button
                          onClick={() =>
                            updateQuantity(book.id, -1, books, setBooks)
                          }
                          className="h-8 w-8 flex items-center justify-center rounded-full border border-gray-200 hover:bg-gray-100 transition-colors"
                        >
                          <MinusIcon className="h-4 w-4" />
                        </button>
                        <span className="text-lg font-medium w-6 text-center">
                          {book.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(book.id, 1, books, setBooks)
                          }
                          className="h-8 w-8 flex items-center justify-center rounded-full border border-gray-200 hover:bg-gray-100 transition-colors"
                        >
                          <PlusIcon className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="text-lg font-medium">
                        ${(book.price * book.quantity).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
                {book.id !== books[books.length - 1].id && (
                  <hr className="mt-6" />
                )}
              </div>
            ))}
          </div>

          <div className="bg-gray-50 p-6 border-t border-gray-200">
            <div className="flex justify-between lg:justify-end items-center mb-6 p-5">
              <span className="text-2xl font-medium p-5">Subtotal</span>
              <span className="text-2xl font-bold">
                ${subtotal(books).toFixed(2)}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-5">
              <button variant="outline" className="gap-2 px-10 py-3 rounded-lg flex border-2 border-black hover:bg-black hover:text-white">
                <ArrowLeftIcon className="h-6 w-6" />
                Continuar comprando
              </button>
              <button className="flex bg-blue-600 text-white gap-2 px-10 py-3 rounded-lg  hover:bg-blue-500 hover:border-blue-600 ">
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
