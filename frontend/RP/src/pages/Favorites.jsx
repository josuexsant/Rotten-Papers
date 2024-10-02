import { useEffect, useState } from 'react';
import { getAllbooks } from '../api/api';
import { Navbar } from '../components/Navbar';

export const Favorites = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function loadBooks() {
      const res = await getAllbooks();
      setBooks(res.data);
      setFilteredBooks(res.data);
    }
    loadBooks();
  }, []);

  const handleRemove = (bookId) => {
    const confirmed = window.confirm(
      '¿Estás seguro de que quieres eliminar este libro de favoritos?'
    );
    if (confirmed) {
      const updatedBooks = books.filter((book) => book.id !== bookId);
      setBooks(updatedBooks);
      setFilteredBooks(updatedBooks);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    if (event.target.value === '') {
      setFilteredBooks(books);
    } else {
      const filtered = books.filter((book) =>
        book.title.toLowerCase().includes(event.target.value.toLowerCase())
      );
      setFilteredBooks(filtered);
    }
  };

  return (
    <>
      <Navbar showAccessButton={false} />

      <div className="bg-gray-800 py-12 text-center">
        <h1 className="text-4xl font-semibold text-white">Mis Favoritos</h1>
      </div>

      <div className="bg-white">
        <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-10 lg:max-w-7xl lg:px-8">
          <div className="mb-6 flex justify-center">
            <input
              type="text"
              placeholder="Buscar en tus favoritos..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full max-w-lg p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 xl:gap-x-8">
            {filteredBooks.map((book) => (
              <div
                key={book.id}
                className="group flex flex-col bg-white rounded-lg overflow-hidden shadow-md border border-gray-200"
              >
                {/* Imagen de portada del libro con tamaño rectangular vertical */}
                <div className="w-full h-72 overflow-hidden">
                  <img
                    alt={book.title}
                    src={book.cover}
                    className="h-full w-full object-cover object-center group-hover:opacity-75"
                  />
                </div>

                {/* Título del libro */}
                <div className="p-2">
                  <h3 className="text-center text-lg font-medium text-gray-900">
                    {book.title}
                  </h3>
                </div>

                {/* Calificación del libro */}
                <div className="flex justify-center mt-2">
                  {[...Array(5)].map((_, index) => (
                    <svg
                      key={index}
                      className="h-5 w-5 text-yellow-500"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.97a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.388 2.46a1 1 0 00-.364 1.118l1.287 3.97c.3.921-.755 1.688-1.54 1.118l-3.388-2.46a1 1 0 00-1.176 0l-3.388 2.46c-.784.57-1.838-.197-1.54-1.118l1.287-3.97a1 1 0 00-.364-1.118L2.045 9.397c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.97z" />
                    </svg>
                  ))}
                </div>

                {/* Botón de eliminar */}
                <div className="mt-4 flex justify-center mb-4">
                  <button
                    onClick={() => handleRemove(book.id)}
                    className="text-gray-500 hover:text-red-600 transition-all duration-300 ease-in-out"
                  >
                    <span className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="h-6 w-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 18M6 6h12l-1.5 12h-9L6 6zM9 6V3.75A1.75 1.75 0 0110.75 2h2.5A1.75 1.75 0 0115 3.75V6M10 10h4"
                        />
                      </svg>
                      <span className="ml-2 text-sm">
                        Eliminar de mis favoritos
                      </span>
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Favorites;
