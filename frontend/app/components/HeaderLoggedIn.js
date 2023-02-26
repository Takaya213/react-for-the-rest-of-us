import React, { useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import ReactTooltip from "react-tooltip";

import DispatchContext from '../DispatchContext'
import StateContext from '../StateContext'

function HeaderLoggedIn(props) {

    const appDispatch = useContext(DispatchContext)
    const appState = useContext(StateContext)

    function handleLogout() {
        appDispatch({ type: 'logout' })
    }

    function handleSearchIcon(e) {
        e.preventDefault()
        appDispatch({ type: 'openSearch' })
    }

    return (
        <div className='flex-row my-3 my-md-0'>
            <a href='#' onClick={handleSearchIcon} data-tip='Search' data-for='search' className='text-white mr-2 header-search-icon'>
                <i className='fas fa-search'></i>
            </a>
            <ReactTooltip place='bottom' id='search' className='custom-tooltip' />{' '}
            <span className='mr-2 header-chat-icon text-white' data-for='chat' data-tip='Chat'>
                <i className='fas fa-comment'></i>
                <span className='chat-count-badge text-white'> </span>
            </span>
            <ReactTooltip place='bottom' id='chat' className='custom-tooltip' />{' '}
            <Link to={`/profile/${appState.user.username}`} data-for='profile' data-tip='My Profile' className='mr-2'>
                <img className='small-header-avatar' src={appState.user.avatar} />
            </Link>
            <ReactTooltip place='bottom' id='profile' className='custom-tooltip' />{' '}
            <Link to='/create-post' className='btn btn-sm btn-success mr-2'>
                Create Post
            </Link>{' '}
            <button onClick={handleLogout} className='btn btn-sm btn-secondary'>
                Sign Out
            </button>
        </div>
    )
}

export default HeaderLoggedIn