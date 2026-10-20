import axios from "axios";


const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? "http://localhost:3000" : "https://moodify-telugu-songs.onrender.com");

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true
})


export async function getSong({ mood }) {
    const response = await api.get("/api/songs?mood=" + mood)
    console.log(response)
    return response.data
}