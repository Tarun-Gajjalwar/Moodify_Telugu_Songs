import axios from "axios"

const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? "http://localhost:3000" : "https://moodify-telugu-songs.onrender.com");

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true
})

export async function register({ email, password, username }) {
    const response = await api.post("/api/auth/register", {
        email, password, username
    })

    return response.data
}

export async function login({ email, username, identifier, password }) {
    const response = await api.post("/api/auth/login", {
        email, username, identifier, password
    })

    return response.data
}

export async function getMe() {
    const response = await api.get("/api/auth/get-me")
    return response.data
}

export async function logout() {
    const response = await api.get("/api/auth/logout")
    return response.data
}