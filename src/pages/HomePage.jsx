import React from 'react'
import Navbar from '../components/Navbar'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import VideoCard from '../components/VideoCard'
import SkeletonLoader from '../components/SkeletonLoader'

const HomePage = () => {
  const [user, setUser] = useState(null)


  const [loading, setLoading] = useState(false)


  const navigate = useNavigate()

  

    // initialize videos from search results state
    const [videos, setVideos] = useState([])


    // initialize channels from search results state
    const [channels, setChannels] = useState([])




  useEffect(() => {
    const token = localStorage.getItem("token")
    async function getUser() {
      const res = await fetch('http://localhost:3001/user_data', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer: ${token}`,
        }
      })
      const data = await res.json()
      if (data?.user) {
        setUser(data.user)
      } else {
        navigate('/login')
      }
    }

    getUser()
  }, [navigate])

  const functionToGetResults = (results) => {
    let resultsVideos = results.filter((i) => i.video);
    let resultsChannels = results.filter((i) => i.channel);
    setVideos(resultsVideos)
    setChannels(resultsChannels)
    console.log(resultsVideos)
    console.log(resultsChannels)
  }




  return (
    <>      
      <Navbar passResultsUpDown={functionToGetResults} setLoading={setLoading}/>

      
      {loading && (
        <div className="videos">
        { Array.from({length: 20}).map((_, i) => (
           <SkeletonLoader key={i} />
        ))}
        </div>
      )}


      <div className="videos">
        {videos.map((video, i) => (
          <VideoCard key={i} video={video} />
        ))}
      </div>
    </>
  )
}

export default HomePage