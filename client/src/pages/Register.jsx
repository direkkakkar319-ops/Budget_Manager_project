import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import './Register.css'
 
import { Eye, EyeOff, User, Mail, Lock, Check, Globe, TrendingUp, Shield, Heart } from 'lucide-react'

export default function Register() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [role, setRole] = useState('salary')
    const [acceptTerms, setAcceptTerms] = useState(false)
    const { register } = useAuth()
    const navigate = useNavigate()
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [showPwd, setShowPwd] = useState(false)
    const [showConfirmPwd, setShowConfirmPwd] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            if (!name.trim()) throw new Error('Name is required')
            if (!email.includes('@')) throw new Error('Enter a valid email')
            if (password.length < 6) throw new Error('Password too short')
            if (password !== confirmPassword) throw new Error('Passwords do not match')
            if (!acceptTerms) throw new Error('Please accept the terms and privacy policy')
            await register(email, password, role)
            navigate('/login')
        } catch (err) {
            setError(err.message || 'Registration failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="register-page" data-testid="register-page">
            <div>
                <h2 className="register-title" data-testid="register-title">Create Account</h2>
                <p className="register-subtitle" data-testid="register-subtitle">Join and manage your finances</p>
            </div>

            {error && (
                <div className="register-error" data-testid="register-error">
                    <svg className="register-error-icon" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="register-form" data-testid="register-form">
                <Input label="Full Name" type="text" value={name} onChange={(e) => setName(e.target.value)} helper="Enter your full name" variant="dark" data-testid="register-name" />
                <Input label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} helper="Use your account email" variant="dark" data-testid="register-email" />
                <Input label="Password" type={showPwd ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} helper="Minimum 6 characters" variant="dark" data-testid="register-password" />
                <button type="button" onClick={() => setShowPwd(v => !v)} className="register-toggle" data-testid="register-password-toggle">
                    {showPwd ? <EyeOff size={14} /> : <Eye size={14} />} {showPwd ? 'Hide' : 'Show'} password
                </button>
                <Input label="Confirm Password" type={showConfirmPwd ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Type Password" variant="dark" data-testid="register-confirm-password" />
                <button type="button" onClick={() => setShowConfirmPwd(v => !v)} className="register-toggle" data-testid="register-confirm-toggle">
                    {showConfirmPwd ? <EyeOff size={14} /> : <Eye size={14} />} {showConfirmPwd ? 'Hide' : 'Show'} password
                </button>

                <div className="register-terms" data-testid="register-terms">
                    <button type="button" onClick={() => setAcceptTerms(!acceptTerms)} className="register-accept-terms" data-testid="register-accept-terms">
                        {acceptTerms && <Check className="register-accept-icon" />}
                    </button>
                    <span className="register-terms-text">
                        I accept the <a href="#" className="register-link-underline">terms of use</a> & <a href="#" className="register-link-underline">privacy policy</a>
                    </span>
                </div>

                <div className="register-role">
                    <label className="register-role-label">Account Type</label>
                    <select value={role} onChange={(e) => setRole(e.target.value)} className="register-select" data-testid="register-role-select">
                        <option value="salary">Salary Person</option>
                        <option value="self_employed">Self Employed</option>
                        <option value="client_mgmt">Enterprise / Client Mgmt</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>

                <Button type="submit" disabled={loading} variant="primary" size="lg" className="register-submit" data-testid="register-submit">
                    {loading ? 'Creating account...' : 'Sign Up'}
                </Button>
            </form>

            <div className="register-footer">
                <p className="register-footer-text">
                    Already have an account?
                    <Link to="/login" className="register-link">Sign In</Link>
                </p>
            </div>
        </div>
    )
}
