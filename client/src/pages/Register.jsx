import { useState } from 'react'
import API from '../api/axios'

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  })

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    try {
      console.log('Sending:', formData)

      const res = await API.post('/register', formData)

      console.log('SUCCESS:', res.data)
      setSuccess(res.data.msg || 'Account created successfully!')
    } catch (err) {
      console.error(err)
      console.log('FULL ERROR RESPONSE:', err.response)
      console.log('BACKEND DATA:', err.response?.data)
      console.log('STATUS:', err.response?.status)

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
        setError('Registration failed.')
      }
    }
  }

  return (
    <div>
      <h1>Register</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
        />

        <br /><br />

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

        <button type="submit">Register</button>
      </form>

      {error && <p>{error}</p>}
      {success && <p>{success}</p>}
    </div>
  )
}

export default Register