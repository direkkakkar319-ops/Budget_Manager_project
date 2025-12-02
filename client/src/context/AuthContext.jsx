import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext()

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (token) {
            axios.get('http://localhost:3001/api/auth/me', {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(res => {
                    setUser({ ...res.data, token })
                })
                .catch(() => {
                    localStorage.removeItem('token')
                })
                .finally(() => setLoading(false))
        } else {
            setLoading(false)
        }
    }, [])

    const login = async (email, password) => {
        const res = await axios.post('http://localhost:3001/api/auth/login', { email, password })
        const { token, role } = res.data
        localStorage.setItem('token', token)
        setUser({ email, role, token })
        return role
    }

    const register = async (email, password, role) => {
        await axios.post('http://localhost:3001/api/auth/register', { email, password, role })
    }

    const logout = () => {
        localStorage.removeItem('token')
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
