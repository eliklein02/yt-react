import React from 'react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Logout = () => {
    const navigate = useNavigate()
    useEffect(() => {
        const token = localStorage.getItem("token")
        if (token) {
            console.log(token)
            async function logout() {
                await fetch('http://localhost:3001/logout', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            localStorage.removeItem("token")
        }
        logout()
        navigate('/login')
        } else {
            navigate('/login')
        }
    }, [navigate])
  return (
    <div>Logging Out...</div>
  )
}

export default Logout