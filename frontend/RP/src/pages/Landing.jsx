import { Navbar } from '../components/Navbar';
import { getAllbooks, addToCart } from '../api/api';
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { host } from '../api/api';
import { useAuth } from '../hooks/useAuth';
import { 
  HeartIcon as HeartIconSolid,
  StarIcon,
  ShoppingCartIcon,
  EyeIcon,
  BookOpenIcon,
  InformationCircleIcon
} from '@heroicons/react/24/solid';
import { HeartIcon as HeartIconOutline } from '@heroicons/react/24/outline';

export const Landing = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState(localStorage.getItem('username'));
  const [message, setMessage] = useState('Descubre un libro cada día...');
  const [likedBooks, setLikedBook] = useState([]);
  const [newFav, setNewFav] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  const useQuery = () => {
    return new URLSearchParams(useLocation().search);
  };

  const query = useQuery();
  const searchQuery = query.get('search') || '';

  useEffect(() => {
    async function loadBooks() {
      setLoading(true);
      try {
        const res = await getAllbooks();
        const filteredBooks = searchQuery
          ? res.data.filter((book) =>
              book.title.toLowerCase().includes(searchQuery.toLowerCase())
            )
          : res.data;
        setBooks(filteredBooks);
      } catch (error) {
        console.error('Error al cargar libros:', error);
      } finally {
        setLoading(false);
      }
    }
    loadBooks();
  }, [searchQuery]);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!isAuthenticated) return;
      
      try {
        const response = await fetch(`${host}/favorites/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${localStorage.getItem('token')}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch favorites');
        }

        const data = await response.json();
        setLikedBook(data);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchFavorites();
  }, [newFav, isAuthenticated]);

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername && storedUsername !== 'null') {
      setUsername(storedUsername);
      setMessage(`Bienvenido ${storedUsername}`);
    } else {
      setMessage('Descubre un mundo de lectura');
    }
  }, []);

  const handleRemove = async (bookId) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    try {
      const response = await fetch(`${host}/favorites/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ book_id: bookId }),
      });

      if (response.ok) {
        setNewFav(!newFav);
        showNotification('Libro eliminado de favoritos', 'success');
      } else {
        showNotification('Error al eliminar el libro de favoritos', 'error');
      }
    } catch (error) {
      console.error('Error:', error);
      showNotification('Error al procesar la solicitud', 'error');
    }
  };

  const handleLike = async (bookId) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    try {
      const response = await fetch(`${host}/favorites/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ book_id: bookId }),
      });

      if (!response.ok) {
        throw new Error('Failed to like book');
      }
      setNewFav(!newFav);
      showNotification('Libro añadido a favoritos', 'success');
    } catch (error) {
      console.error('Error:', error);
      showNotification('Error al añadir a favoritos', 'error');
    }
  };

  const handleAddToCart = async (bookId) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    try {
      const response = await addToCart(bookId);
      showNotification(response.data.message, 'success');
    } catch (err) {
      showNotification(err.response?.data?.message || "Error al agregar el libro.", 'error');
    }
  };

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  // Función para truncar texto
  const truncateText = (text, maxLength) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const isBookLiked = (bookId) => {
    return likedBooks.some(book => book.book_id === bookId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Notificación */}
      {notification.show && (
        <div 
          className={`fixed top-20 right-4 z-50 px-4 py-3 rounded-lg shadow-lg 
            ${notification.type === 'success' ? 'bg-green-100 text-green-800 border-l-4 border-green-500' : 
            'bg-red-100 text-red-800 border-l-4 border-red-500'} 
            transition-opacity duration-300`}
        >
          {notification.message}
        </div>
      )}
      
      {/* Mensaje de bienvenida */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-12 px-4 sm:px-6 lg:px-8 mb-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-center">{message}</h1>
          <p className="mt-4 text-xl text-center max-w-3xl mx-auto">
            Encuentra tu próxima aventura literaria en nuestra biblioteca digital
          </p>
        </div>
      </div>
      
      {/* Filtros o categorías (opcional) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="flex flex-wrap gap-3 justify-center">
          {['Todos', 'Ficción', 'Aventura', 'Clásicos', 'Romance', 'Historia'].map((category) => (
            <button 
              key={category}
              className="px-4 py-2 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow border border-gray-200 text-gray-700 font-medium"
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de libros */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            <p className="ml-3 text-lg font-medium text-gray-700">Cargando libros...</p>
          </div>
        ) : books.length === 0 ? (
          <div className="text-center py-12">
            <BookOpenIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-700 mb-2">No se encontraron libros</h3>
            <p className="text-gray-500">
              {searchQuery 
                ? `No hay resultados para "${searchQuery}". Intenta con otro término.` 
                : "No hay libros disponibles en este momento."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {books.map((book) => (
              <div 
                key={book.book_id}
                className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg flex flex-col h-full"
              >
                <div className="relative aspect-[2/3] overflow-hidden group">
                  <img
                    src={book.cover}
                    alt={book.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                    <button
                      onClick={() => navigate(`/reviews/${book.book_id}`)}
                      className="bg-white/90 text-gray-900 font-medium py-2 px-4 rounded-lg flex items-center justify-center hover:bg-white transition-colors"
                    >
                      <EyeIcon className="h-5 w-5 mr-2" />
                      Ver detalles
                    </button>
                  </div>
                  
                  {/* Etiqueta de precio */}
                  <div className="absolute top-3 right-3 bg-white/90 text-gray-900 font-bold py-1 px-3 rounded-full shadow-md">
                    ${book.price} MXN
                  </div>
                </div>
                
                <div className="p-4 flex-grow flex flex-col">
                  <h3 className="text-lg font-bold text-gray-800 mb-1 line-clamp-2">{book.title}</h3>
                  
                  {/* Calificación */}
                  <div className="flex items-center mb-3">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <StarIcon
                          key={star}
                          className={`h-4 w-4 ${
                            star <= Math.round(book.rating) ? 'text-yellow-500' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-600">({book.rating.toFixed(1)})</span>
                  </div>
                  
                  {/* Sinopsis resumida */}
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                    {truncateText(book.synopsis, 120)}
                  </p>
                  
                  {/* Stock (condicional) */}
                  {book.stock && book.stock < 10 && (
                    <div className="mb-3 flex items-center text-sm text-amber-700">
                      <InformationCircleIcon className="h-4 w-4 mr-1" />
                      <span>¡Quedan solo {book.stock} unidades!</span>
                    </div>
                  )}
                  
                  <div className="mt-auto flex flex-col gap-2">
                    <button
                      onClick={() => handleAddToCart(book.book_id)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center transition-colors"
                    >
                      <ShoppingCartIcon className="h-5 w-5 mr-2" />
                      Agregar al carrito
                    </button>
                    
                    <button
                      onClick={() => isBookLiked(book.book_id) ? handleRemove(book.book_id) : handleLike(book.book_id)}
                      className={`w-full font-medium py-2 px-4 rounded-lg flex items-center justify-center transition-colors
                        ${isBookLiked(book.book_id) 
                          ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200' 
                          : 'bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700'
                        }`}
                    >
                      {isBookLiked(book.book_id) ? (
                        <>
                          <HeartIconSolid className="h-5 w-5 mr-2 text-red-500" />
                          En mis favoritos
                        </>
                      ) : (
                        <>
                          <HeartIconOutline className="h-5 w-5 mr-2" />
                          Añadir a favoritos
                        </>
                      )}
                    </button>
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

export default Landing;