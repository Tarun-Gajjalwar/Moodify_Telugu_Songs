import { login, register, getMe, logout } from "../services/auth.api";
import { useContext } from "react";
import { AuthContext } from "../auth.context";

export const useAuth = () => {
    const context = useContext(AuthContext)
    const { user, setUser, loading, setLoading } = context

    async function handleRegister({ username, email, password }) {
        setLoading(true)
        try {
            const data = await register({ username, email, password })
            setUser(data.user)
            return data
        } finally {
            setLoading(false)
        }
    }

    async function handleLogin({ username, email, identifier, password }) {
        setLoading(true)
        try {
            const data = await login({ username, email, identifier, password })
            setUser(data.user)
            return data
        } finally {
            setLoading(false)
        }
    }

    async function handleGetMe() {
        setLoading(true)
        try {
            const data = await getMe()
            setUser(data.user)
            return data
        } catch (err) {
            setUser(null)
        } finally {
            setLoading(false)
        }
    }

    async function handleLogout() {
        setLoading(true)
        try {
            const data = await logout()
            setUser(null)
            return data
        } finally {
            setLoading(false)
        }
    }

    return {
        user, loading, handleRegister, handleLogin, handleLogout, handleGetMe
    }
}