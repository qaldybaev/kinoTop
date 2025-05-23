import axios from "axios"
console.log("SERVER_BASE_URL:", import.meta.env.VITE_SERVER_BASE_URL);


const customAxios = axios.create({
    baseURL:process.env.VITE_SERVER_BASE_URL,
    withCredentials: true,
    timeout:10000
})

export default customAxios