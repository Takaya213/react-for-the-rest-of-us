import React, { useEffect, useState, useContext } from 'react'
import axios from 'axios'
import { useParams, Link } from 'react-router-dom'

import LoadingDotsIcon from './LoadingDotsIcon'
import StateContext from '../StateContext'

function ProfileFollowers(props) {
    const appState = useContext(StateContext)
    const [isLoading, setIsLoading] = useState(true)
    const [posts, setPosts] = useState([])
    const { username } = useParams()

    useEffect(() => {
        const ourRequest = axios.CancelToken.source();

        async function fetchFollowers() {
            try {
                const response = await axios.get(`/profile/${username}/followers`, { cancelToken: ourRequest.token })
                setPosts(response.data)
                setIsLoading(false)
            } catch (e) {
                console.log('Problem')
            }
        }
        fetchFollowers();
      return () => {
        ourRequest.cancel();
      };
    }, [username])

    if (isLoading) return <LoadingDotsIcon />

  return (
      <div className='list-group'>
        {posts.length > 0 && 
            posts.map((follower, index) => {
                return (
                    <Link to={`/profile/${follower.username}`} key={index} className='list-group-item list-group-item-action'>
                        <img className='avatar-tiny' src={follower.avatar} /> {follower.username}
                    </Link>
                )
            })
        }
        {posts.length == 0 && appState.user.username == username && <p className='lead text-muted text-center'>You don't have any followers yet.</p>}
        {posts.length == 0 && appState.user.username != username && (
        <p className='lead text-muted text-center'>
          {username} doesn't have any followers yet.
          {appState.loggedIn && ' Be the first to follow them!'}
          {!appState.loggedIn && (
            <>
              {' '}
              If you want to follow them you need to <Link to='/'>sign up</Link> for an account first.{' '}
            </>
          )}
        </p>
      )}
      </div>
  )
}

export default ProfileFollowers