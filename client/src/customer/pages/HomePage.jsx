import React, { useContext, useEffect } from 'react'
import Header from '../sections/Header'
import Hero from '../sections/Hero'
import { AuthContext } from '../../context/AuthContext'
import UserServices from '../sections/UserServices'
import About from '../sections/About'
import Services from '../sections/Services'
import Procedure from '../sections/Procedure'
import Footer from '../sections/Footer'
import { useNavigate } from 'react-router-dom'

const HomePage = () => {

  const { user } = useContext(AuthContext);
  const navigate = useNavigate()

  useEffect(() => {
    if (user && user.role === 'owner') {
      navigate('/admin')
    }
  }, [user, navigate])

  return (
    <div>
        <Header/>
        { !user ?
            <Hero/>
            : <UserServices/>
        }
        {
          !user && (
            <About/>
          )
        }
        {
          !user && (
            <>
              <Services/>
              <Procedure/>
            </>
          )
        }
        <Footer/>
    </div>
  )
}

export default HomePage
