import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import API from '../api/axios'

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      console.log('Sending login:', formData)

      const res = await API.post('/login', formData)

      console.log('LOGIN SUCCESS:', res.data)

      const token = res.data.token
      localStorage.setItem('token', token)

      navigate('/dashboard')
    } catch (err) {
      console.error(err)
      console.log('LOGIN ERROR:', err.response?.data)

      const data = err.response?.data

      if (typeof data === 'string') {
        setError(data)
      } else if (data?.msg) {
        setError(data.msg)
      } else if (data?.message) {
        setError(data.message)
      } else if (data?.error) {
        setError(data.error)
      } else {
        setError('Login failed.')
      }
    }
  }

  return (
    <div>
      <h1>Login</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <br /><br />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <br /><br />

        <button type="submit">Login</button>
      </form>

      {error && <p>{error}</p>}

      <p>
        Don&apos;t have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  )
}

export default Login