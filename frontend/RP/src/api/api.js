import axios from "axios";


const users = axios.create({
    baseURL: 'http://127.0.0.1:8000/signin/'
})

const books = axios.create({
    baseURL: 'http://127.0.0.1:8000/books/'
})

const author = axios.create({
    baseURL: 'http://127.0.0.1:8000/author/'
})

const login = axios.create({
        baseURL: 'http://127.0.0.1:8000/login/'
})

const reviews = axios.create({
    baseURL: 'http://127.0.0.1:8000/reviews/'
})  


export const createUser = (user) => users.post('/', user);
export const getAllbooks = () => books.get('/');
export const getAuthor = () => author.get('/');
export const loginUser = (user) => login.post('/', user);
export const getBook = (book_id) => books.get(`?book_id=${book_id}`);