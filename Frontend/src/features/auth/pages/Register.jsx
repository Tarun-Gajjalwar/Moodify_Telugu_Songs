import React, { useState } from 'react'
import "../style/register.scss"
import FormGroup from '../components/FormGroup'
import { Link } from 'react-router'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router'

const Register = () => {

    const [ username, setUsername ] = useState("")
    const [ email, setEmail ] = useState("")
    const [ password, setPassword ] = useState("")
    const [ error, setError ] = useState("")

    const navigate = useNavigate()

    const { loading, handleRegister } = useAuth()

    async function handleSubmit(e) {
        e.preventDefault()
        setError("")
        try {
            await handleRegister({ username, password, email })
            navigate('/')
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed. Please try again.")
        }
    }

    return (
        <main className="register-page">
            <div className="form-container">
                <h1>Register</h1>
                {error && <p style={{ color: "#ff6b6b", fontSize: "0.9rem", background: "rgba(255,107,107,0.1)", padding: "0.5rem", borderRadius: "4px" }}>{error}</p>}
                <form onSubmit={handleSubmit} >
                    <FormGroup
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        label="Name" placeholder="Enter your name" />
                    <FormGroup
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                        label="Email" placeholder="Enter your email" />
                    <FormGroup
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type="password"
                        label="Password" placeholder="Enter your password" />
                    <button className='button' type="submit" disabled={loading}>
                        {loading ? "Registering..." : "Register"}
                    </button>
                </form>
                <p>Already have an account? <Link to="/login">Login here</Link></p>
            </div>
        </main>
    )
}

export default Register


