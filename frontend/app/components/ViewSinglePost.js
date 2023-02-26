import React, { useContext, useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import ReactMarkdown from 'react-markdown'
import ReactTooltip from 'react-tooltip'

import StateContext from '../StateContext'
import DispatchContext from '../DispatchContext'

import NotFound from './NotFound'
import Page from './Page'
import LoadingDotsIcon from './LoadingDotsIcon'

function ViewSinglePost() {
  
  const navigate = useNavigate()
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)
  
  const {id} = useParams()
  const [isLoading, setIsLoading] = useState(true)
  const [post, setPost] = useState()

    useEffect(() => {
      const ourRequest = axios.CancelToken.source()

      async function fetchPost() {
          try {
              const response = await axios.get(`/post/${id}`, {cancelToken: ourRequest.token})
              setPost(response.data)
              setIsLoading(false)
          } catch (e) {
              console.log('Problem')
          }
      }
      fetchPost()
      return () => {
        ourRequest.cancel()
      }
    }, [id])

    if (!isLoading && !post) {
      return <NotFound />
    }


  if (isLoading) 
    return (
      <Page title='...'>
        <LoadingDotsIcon />
      </Page>
    )

    const date = new Date(post.createdDate)
    const dateFormated = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`

    function isOwner () {
      if (appState.loggedIn) {
        return appState.user.username == post.author.username
      }
      return false
    }

    async function deleteHandler(e) {
      const areYouSure = window.confirm('Do you really want to delete this post?')

      if (areYouSure) {
        try {
          const respone = await axios.delete(`/post/${id}`, { data: { token: appState.user.token } })
          if (respone.data == 'Success') {
            appDispatch({ type: 'flashMessage', value: 'Post was successfully deleted.' })
            navigate(`/profile/${appState.user.username}`)
          }
        } catch (e) {
          console.log('Problem')
        }
      }
    }

  return (
    <Page title={post.title}>
      <div className='d-flex justify-content-between'>
        <h2>{post.title}</h2>
        {isOwner() && (
          <span className='pt-2'>
            <Link to={`/post/${post._id}/edit`} data-tip='Edit post' data-for='edit' data-tooltip-place='top' className='text-primary mr-2'>
              <i className='fas fa-edit'></i>
            </Link>
            <ReactTooltip id='edit' className='custom-tooltip' />{' '}
            <a onClick={deleteHandler} data-tip='Delete post' data-for='delete' className='delete-post-button text-danger'>
              <i className='fas fa-trash'></i>
            </a>
            <ReactTooltip id='delete' className='custom-tooltip' />
          </span>
        )}
      </div>

      <p className='text-muted small mb-4'>
        <Link to={`/profile/${post.author.username}`}>
          <img className='avatar-tiny' src={post.author.avatar} />
        </Link>
        Posted by <Link to={`/profile/${post.author.username}`}>{post.author.username}</Link> on {dateFormated}
      </p>

      <div className='body-content'>
        <ReactMarkdown children={post.body} allowedElements={['p', 'br', 'strong', 'em', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'a']} />
      </div>
    </Page>
  )
}

export default ViewSinglePost