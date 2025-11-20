import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
 

export default function Register() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [role, setRole] = useState('salary')
    const { register } = useAuth()
    const navigate = useNavigate()
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [showPwd, setShowPwd] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            if (!email.includes('@')) throw new Error('Enter a valid email')
            if (password.length < 6) throw new Error('Password too short')
            await register(email, password, role)
            navigate('/login')
        } catch (err) {
            setError(err.message || 'Registration failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            <h2 className="text-2xl font-bold text-center mb-2 text-gray-800">Create Account</h2>
            <p className="text-center text-gray-500 text-sm mb-6">Join BudgetFlow today</p>

            {error && (
                <div className="bg-gradient-red-pink-light border border-red-200 text-red-700 p-4 rounded-xl mb-6 text-sm flex items-center gap-3">
                    <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                <Input label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} helper="Use a valid email" />
                <div>
                    <Input label="Password" type={showPwd ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} helper="Minimum 6 characters" />
                    <button type="button" onClick={() => setShowPwd(v => !v)} className="text-xs text-gray-500 mt-1">{showPwd ? 'Hide' : 'Show'} password</button>
                </div>
                <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">Account Type</label>
                    <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-orange-500">
                        <option value="salary">Salary Person</option>
                        <option value="self_employed">Self Employed</option>
                        <option value="client_mgmt">Enterprise / Client Mgmt</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
                <Button type="submit" disabled={loading} variant="primary" size="lg" className="w-full">
                    {loading ? 'Creating account...' : 'Create Account'}
                </Button>
            </form>

            <div className="mt-8 text-center">
                <p className="text-gray-600 text-sm">
                    Already have an account?
                    <Link to="/login" className="ml-1 text-gradient-purple-pink hover-text-gradient-purple-pink-dark font-bold">
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    )
}
