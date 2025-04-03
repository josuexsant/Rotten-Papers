import axios from 'axios';
// Host para usar en local
export const host = 'http://127.0.0.1:8000';

// Host para hacer deploy
//export const host = 'https://backend:8000';

const books = axios.create({
  baseURL: `${host}/books/`,
});

const author = axios.create({
  baseURL: `${host}/author/`,
});

export const getAllbooks = () => books.get('/');
export const getAuthor = () => author.get('/');
export const getBook = (book_id) => books.get(`?book_id=${book_id}`);
