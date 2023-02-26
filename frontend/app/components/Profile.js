import React, { useEffect, useContext, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import axios from 'axios'
import StateContext from '../StateContext'

import Page from './Page'
import ProfilePosts from './ProfilePosts'

function Profile() {

    const {username} = useParams()
    const appState = useContext(StateContext)
    const [profileDate, setProfileDate] = useState({
        profileUsername: '...',
        profileAvatar: 'https://gravatar.com/avatar/placeholder?s=128',
        isFollowing: false,
        counts: {postCount: '', followerCount: '', followingCount: ''}
    })

    useEffect(() => {
      const ourRequest = axios.CancelToken.source();
      
        async function fetchData() {
            try {
                const response = await axios.post(`/profile/${username}`, {token: appState.user.token}, {cancelToken: ourRequest.token})
                setProfileDate(response.data)
            } catch(e) {
                console.log('Problem')
            }
        }
        fetchData()
      return () => {
        ourRequest.cancel();
      };
    }, [])

    return (
    <Page title='Profile'>
      <h2>
        <img className='avatar-small' src={profileDate.profileAvatar} /> {profileDate.profileUsername}
        <button className='btn btn-primary btn-sm ml-2'>Follow <i className='fas fa-user-plus'></i></button>
      </h2>

      <div className='profile-nav nav nav-tabs pt-2 mb-4'>
        <a href='#' className='active nav-item nav-link'>
          Posts: {profileDate.counts.postCount}
        </a>
        <a href='#' className='nav-item nav-link'>
          Followers: {profileDate.counts.followerCount}
        </a>
        <a href='#' className='nav-item nav-link'>
          Following: {profileDate.counts.followingCount}
        </a>
      </div>

        <ProfilePosts />

    </Page>
  )
}

export default Profile