import axios from "axios";

const users = axios.create({
    baseURL: 'http://127.0.0.1:8000/rp/signin/'
})

const books = axios.create({
    baseURL: 'http://127.0.0.1:8000/rp/books/'
})

const author = axios.create({
    baseURL: 'http://127.0.0.1:8000/rp/author/'
})

const login = axios.create({
        baseURL: 'http://127.0.0.1:8000/rp/login/'
})

export const createUser = (user) => users.post('/', user);
export const getAllbooks = () => books.get('/');
export const getAuthor = () => author.get('/');
export const loginUser = (user) => login.post('/', user);


