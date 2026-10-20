import React, { useState } from 'react'
import "../style/login.scss"
import FormGroup from '../components/FormGroup'
import { Link } from 'react-router'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router'

const Login = () => {

    const { loading, handleLogin } = useAuth()

    const navigate = useNavigate()

    const [ identifier, setIdentifier ] = useState("")
    const [ password, setPassword ] = useState("")
    const [ error, setError ] = useState("")

    async function handleSubmit(e) {
        e.preventDefault()
        setError("")
        try {
            await handleLogin({ identifier, password })
            navigate("/")
        } catch (err) {
            setError(err.response?.data?.message || "Login failed. Please check your credentials.")
        }
    }

    return (
        <main className="login-page">
            <div className="form-container">
                <h1>Login</h1>
                {error && <p style={{ color: "#ff6b6b", fontSize: "0.9rem", background: "rgba(255,107,107,0.1)", padding: "0.5rem", borderRadius: "4px" }}>{error}</p>}
                <form onSubmit={handleSubmit} >
                    <FormGroup
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        label="Email or Username"
                        placeholder="Enter your email or username"
                    />
                    <FormGroup
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        label="Password"
                        type="password"
                        placeholder="Enter your password"
                    />
                    <button className='button' type="submit" disabled={loading}>
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>
                <p>Don't have an account? <Link to="/register">Register here</Link></p>
            </div>
        </main>
    )
}

export default Login