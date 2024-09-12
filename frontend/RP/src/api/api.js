import axios from "axios";

const users = axios.create({
    baseURL: 'http://127.0.0.1:8000/rp/signin/'
})

export const createUser = (user) => users.post('/', user);


