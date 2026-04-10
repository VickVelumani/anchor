import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import API from '../api/axios'

function UpdateUrge() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    intervention_type: '',
    intervention_response: '',
    outcome: '',
    post_reflection: '',
  })

  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMsg('')
    setError('')

    try {
      console.log('Sending update:', formData)

      const res = await API.put(`/urges/${id}`, formData)

      console.log('UPDATE SUCCESS:', res.data)
      setMsg(res.data.message)

      setTimeout(() => {
        navigate('/dashboard')
      }, 1000)
    } catch (err) {
      console.error(err)
      console.log('UPDATE ERROR DATA:', err.response?.data)
      console.log('UPDATE STATUS:', err.response?.status)

      if (err.response?.status === 401) {
        setError('Session expired. Please log in again.')
      } else {
        const data = err.response?.data

        if (typeof data === 'string') {
          setError(data)
        } else if (data?.error) {
          setError(data.error)
        } else if (data?.message) {
          setError(data.message)
        } else {
          setError('Failed to update urge')
        }
      }
    }
  }

  return (
    <div style={{ padding: '20px' }}>
      <button onClick={() => navigate('/dashboard')}>
        Back to Dashboard
      </button>

      <h1>Update Urge</h1>

      <form onSubmit={handleSubmit}>
        <input
          name="intervention_type"
          placeholder="What did you do?"
          value={formData.intervention_type}
          onChange={handleChange}
        />

        <br /><br />

        <input
          name="intervention_response"
          placeholder="How did it feel?"
          value={formData.intervention_response}
          onChange={handleChange}
        />

        <br /><br />

        <select
          name="outcome"
          value={formData.outcome}
          onChange={handleChange}
        >
          <option value="">Select outcome</option>
          <option value="resisted">Resisted</option>
          <option value="gave_in">Gave In</option>
        </select>

        <br /><br />

        <textarea
          name="post_reflection"
          placeholder="Reflection"
          value={formData.post_reflection}
          onChange={handleChange}
        />

        <br /><br />

        <button type="submit">Save</button>
      </form>

      {msg && <p>{msg}</p>}
      {error && <p>{error}</p>}
    </div>
  )
}

export default UpdateUrge