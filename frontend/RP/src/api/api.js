import axios from 'axios';
// Host para usar en local
//export const host = 'http://127.0.0.1:8000';

// Host para hacer deploy
export const host = 'http://54.91.180.108:8000';

const books = axios.create({
  baseURL: `${host}/books/`,
});

const author = axios.create({
  baseURL: `${host}/author/`,
});

// Instancia para shopping cart
const shoppingCart = axios.create({
  baseURL: `${host}/shoppingCar/`,
});

// Instancia para shopping cart books
const shoppingCartBooks = axios.create({
  baseURL: `${host}/shoppingCartBooks/`,
});

// Función para obtener el token de autenticación
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Token ${token}` } : {};
};

export const getAllbooks = () => books.get('/');
export const getAuthor = () => author.get('/');
export const getBook = (book_id) => books.get(`?book_id=${book_id}`);
// Obtener libros del carrito
export const getCartBooks = () =>
  shoppingCartBooks.get('/', {
    headers: getAuthHeaders(),
  });

// Añadir un libro al carrito
export const addToCart = (book_id) =>
  shoppingCart.post('/', { book_id }, { headers: getAuthHeaders() });


// Eliminar un libro del carrito
export const removeFromCart = (book_id) =>
  shoppingCart.delete('/', {
    headers: getAuthHeaders(),
    data: { book_id },
  });
