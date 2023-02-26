import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams, Link } from 'react-router-dom'

import LoadingDotsIcon from './LoadingDotsIcon'

function ProfilePosts(props) {

    const [isLoading, setIsLoading] = useState(true)
    const [posts, setPosts] = useState([])
    const { username } = useParams()

    useEffect(() => {
        const ourRequest = axios.CancelToken.source();

        async function fetchPosts() {
            try {
                const response = await axios.get(`/profile/${username}/posts`, { cancelToken: ourRequest.token })
                setPosts(response.data)
                setIsLoading(false)
            } catch (e) {
                console.log('Problem')
            }
        }
        fetchPosts()
      return () => {
        ourRequest.cancel();
      };
    }, [])

    if (isLoading) return <LoadingDotsIcon />

  return (
      <div className='list-group'>
        {posts.map(post => {
            const date = new Date(post.createdDate)
            const dateFormated = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
            return (
                <Link to={`/post/${post._id}`} key={post._id} className='list-group-item list-group-item-action'>
                    <img className='avatar-tiny' src={post.author.avatar} /> <strong>{post.title}</strong> {' '}
                    <span className='text-muted small'>on {dateFormated} </span>
                </Link>
            )
        })}
      </div>
  )
}

export default ProfilePosts