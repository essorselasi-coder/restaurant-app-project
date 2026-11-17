import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import '../styles/login.css'

function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  function handleSubmit(e) {
    e.preventDefault()
    const result = login(username.trim(), password)

    if (!result.success) {
      setError(result.message)
      return
    }

    navigate(result.user.role === 'admin' ? '/dashboard' : '/orders')
  }

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <h1>Restaurant App</h1>
        <p className="login-subtitle">Sign in to continue</p>

        {error && <p className="login-error">{error}</p>}

        <label htmlFor="username">Username</label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Log in</button>

        <p className="login-hint">
          Test logins: admin / admin123, waiter / waiter123, kitchen / kitchen123
        </p>
      </form>
    </div>
  )
}

export default Login