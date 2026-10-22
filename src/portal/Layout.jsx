import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from './base/Header'
import Footer from './base/Footer'

const Layout = ({userLoggedOut, userLogged}) => {
  return (
    <>
        <Header userLogged = {userLogged} userLoggedOut = {userLoggedOut}/>
            <Outlet/>
        <Footer/>
    </>
  )
}

export default Layout
