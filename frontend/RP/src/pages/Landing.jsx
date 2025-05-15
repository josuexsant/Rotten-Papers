import { Navbar } from '../components/Navbar';
import { getAllbooks, addToCart } from '../api/api';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { host } from '../api/api';
import { useAuth } from '../hooks/useAuth';
import { useLocation } from 'react-router-dom';
import { Button } from '@headlessui/react';

export const Landing = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [Books, setBooks] = useState([]);
  const [username, setUsername] = useState(localStorage.getItem('username'));
  const [message, setMessage] = useState('Descubre un libro cada día...');
  const [likedBooks, setLikedBook] = useState([]);
  const [newFav, setNewFav] = useState(false);
  const useQuery = () => {
    return new URLSearchParams(useLocation().search);
  };

  const query = useQuery();
  const searchQuery = query.get('search') || '';

  useEffect(() => {
    async function loadBooks() {
      const res = await getAllbooks();
      const filteredBooks = searchQuery
        ? res.data.filter((book) =>
            book.title.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : res.data; // Mostrar todos los libros si no hay búsqueda
      setBooks(filteredBooks);
    }
    loadBooks();
  }, [searchQuery]);
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await fetch(`${host}/favorites/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${localStorage.getItem('token')}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to like book');
        }

        const data = await response.json();
        setLikedBook(data);
        console.log(data);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchFavorites();
  }, [newFav]);

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const handleRemove = async (bookId) => {
    fetch(`${host}/favorites/`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ book_id: bookId }),
    })
      .then((response) => {
        console.log(response);
        if (response.ok) {
          setNewFav(!newFav);
        } else {
          console.error('Error al eliminar el libro');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const handleLike = async (book_id) => {
    try {
      const response = await fetch(`${host}/favorites/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ book_id }),
      });

      if (!response.ok) {
        throw new Error('Failed to like book');
      }
      setNewFav(!newFav);
      console.log('Book liked');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    if (username && username !== 'null') {
      setMessage(`Bienvenido ${username}`);
    } else {
      setMessage('Descubre más...');
    }
  }, [username]);

  // Añadir libro al carrito
  const handleAddToCart = async (bookId) => {
    try {
      const response = await addToCart(bookId);
      alert(response.data.message);
    } catch (err) {
      alert(err.response?.data?.message || "Error al agregar el libro.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="bg-white">
        <div className="text-center text-gray-600 text-3xl font-semibold my-4">
          {message}
        </div>

        <div className="mx-auto max-w-2xl px-4 sm:px-2 sm:max-w-4xl sm: lg:max-w-7xl lg:px-8">
          <h2 className="sr-only">Products</h2>

          <div className="rounded-lg p-3 bg-white">
            <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 xl:gap-x-8">
              {Books.map((book) => (
                <div
                  key={book.book_id}
                  className="group flex flex-col bg-slate-50 rounded-xl shadow-md"
                >
                  <div className="flex flex-row overflow-hidden h-72">
                    <div className="relative w-1/2 group">
                      {/* Imagen */}
                      <img
                        alt={'book'}
                        src={book.cover}
                        className="h-full w-full object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
                      />

                      <div
                        className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"
                        onClick={() => navigate(`/reviews/${book.book_id}`)}
                      >
                        <span className="text-white text-lg font-medium">
                          Ver reseñas
                        </span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="2"
                          stroke="currentColor"
                          className="w-8 h-8 text-white mb-2"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 5c-7.333 0-10 7-10 7s2.667 7 10 7 10-7 10-7-2.667-7-10-7z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 9a3 3 0 100 6 3 3 0 000-6z"
                          />
                        </svg>
                      </div>
                    </div>

                    <div className="p-4 w-1/2 flex flex-col justify-between">
                      <div>
                        <p className="mt-1 text-lg font-medium text-gray-600">
                          {book.title}
                        </p>
                        <p className="mt-1 text-lg font-medium text-bold text-gray-600">
                          $ {book.price} MXN
                        </p>
                        {/*TODO: AGREGA LA FUNCION DE QUEDAN POCOS... */}
                        <p className="mt-1 text-lg font-medium text-bold text-gray-600">
                         
                        </p>
                        <div className="flex items-center mt-2">
                          <p className="text-gray-500">{book.rating}</p>
                          {[...Array(5)].map((_, index) => (
                            <svg
                              key={index}
                              className={`h-5 w-5 ${
                                index < book.rating
                                  ? 'text-yellow-500'
                                  : 'text-gray-300'
                              }`}
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.97a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.388 2.46a1 1 0 00-.364 1.118l1.287 3.97c.3.921-.755 1.688-1.54 1.118l-3.388-2.46a1 1 0 00-1.176 0l-3.388 2.46c-.784.57-1.838-.197-1.54-1.118l1.287-3.97a1 1 0 00-.364-1.118L2.045 9.397c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.97z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                      <div className="mt-4 flex-1 overflow-hidden">
                        <p className="text-sm text-gray-800 h-auto overflow-hidden group-hover:max-h-full group-hover:overflow-auto transition-all duration-300 ease-in-out">
                          {book.synopsis}
                        </p>
                      </div>
                      <div className="mt-4 flex-col justify-center">
                        {likedBooks
                          .map((book) => book.book_id)
                          .includes(book.book_id) ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemove(book.book_id);
                              alert('Se ha borrado el libro de favoritos...');
                            }}
                          >
                            <div className="flex flex-row items-center align-middle justify-between">
                              <p className="mx-1">Me gusta</p>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                height="24px"
                                viewBox="0 -960 960 960"
                                width="24px"
                                fill="#EA3323"
                              >
                                <path d="m 480 -120 l -58 -52 q -101 -91 -167 -157 T 150 -447.5 Q 111 -500 95.5 -544 T 80 -634 q 0 -94 63 -157 t 157 -63 q 52 0 99 22 t 81 62 q 34 -40 81 -62 t 99 -22 q 94 0 157 63 t 63 157 q 0 46 -15.5 90 T 810 -447.5 Q 771 -395 705 -329 T 538 -172 l -58 52 Z Z Z" />
                              </svg>
                            </div>
                          </button>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (isAuthenticated) {
                                handleLike(book.book_id);
                              } else {
                                navigate('/login');
                              }
                            }}
                            className="group"
                          >
                            <div className="flex flex-row items-center align-middle justify-between">
                              <p className="mx-1 text-gray-500">Me gusta</p>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                height="24px"
                                viewBox="0 -960 960 960"
                                width="24px"
                                fill="#EA3323"
                                className="transition-transform duration-300 group-hover:scale-125 group-hover:fill-red-500"
                              >
                                <path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z" />
                              </svg>
                            </div>
                          </button>
                        )}
                        <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isAuthenticated) {
                            handleAddToCart(book.book_id);
                          } else {
                            navigate('/login');
                          }
                        }}
                        className='bg-orange-200 p-3 rounded-md'>
                          Agregar al carrito
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
