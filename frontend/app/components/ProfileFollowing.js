import React, { useEffect, useState, useContext } from 'react'
import axios from 'axios'
import { useParams, Link } from 'react-router-dom'

import LoadingDotsIcon from './LoadingDotsIcon'
import StateContext from '../StateContext'

function ProfileFollowing(props) {
    const appState = useContext(StateContext)
    const [isLoading, setIsLoading] = useState(true)
    const [posts, setPosts] = useState([])
    const { username } = useParams()

    useEffect(() => {
        const ourRequest = axios.CancelToken.source();

        async function fetchPfollowing() {
            try {
                const response = await axios.get(`/profile/${username}/following`, { cancelToken: ourRequest.token })
                setPosts(response.data)
                setIsLoading(false)
            } catch (e) {
                console.log('Problem')
            }
        }
        fetchPfollowing();
      return () => {
        ourRequest.cancel();
      };
    }, [username])

    if (isLoading) return <LoadingDotsIcon />

  return (
      <div className='list-group'>
        {posts.length > 0 &&
            posts.map((following, index) => {
                return (
                    <Link to={`/profile/${following.username}`} key={index} className='list-group-item list-group-item-action'>
                        <img className='avatar-tiny' src={following.avatar} /> {following.username}
                    </Link>
                )
            })
        }
        {posts.length == 0 && appState.user.username == username && <p className="lead text-muted text-center">You aren't following anyone yet.</p>}
        {posts.length == 0 && appState.user.username != username && <p className="lead text-muted text-center">{username} isn't following anyone yet.</p>}
      </div>
  )
}

export default ProfileFollowing