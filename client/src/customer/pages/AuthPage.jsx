import React, { useContext, useEffect, useState } from 'react'
import printer from '../../assets/printer.svg'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-hot-toast'

const AuthPage = ({type}) => {

  const navigate = useNavigate();

  const { login, register } = useContext(AuthContext)
  const [ form, setForm ] = useState({ name:'', email:'', password:'', phone:'' })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]:e.target.value})    
  }
  const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true)
      try {
        if(type === 'login') {
          const response = await login(form.email, form.password)
          toast.success(`Welcome back, ${response.name}`)
          navigate('/')
        } else {
          if(!form.name || !form.email || !form.password || !form.phone) {
            toast.error('Please fill all the fields!')
            setLoading(false)
            return
          }
          const response = await register(form)
          toast.success(`Account created for ${response.name}`)
          navigate('/')
        }
      } catch (error) {
        const message = error.response?.data?.message || 'Authentication failed!';
        toast.error(message)
      } finally {
        setLoading(false)
      }
  }

  const inputStyle = 'w-full h-10 p-2.5 rounded-2xl text-[#475569] shadow placeholder:text-sm focus:outline-none'

  return (
    <div className='bg-gradient-to-br from-[#688ee0] from-50% to-[#b8c3dd] to-30% min-h-screen flex justify-center items-center'>
      <div className='w-[70%] min-h-[75vh] shadow-lg rounded-[4rem] flex justify-between bg-[#ebedefe3] p-2.5'>
        <div className='basis-[56%]'>
            <form onSubmit={handleSubmit} className='flex flex-col items-center justify-center h-full w-3/5 mx-auto gap-5'>
                <h1 className='font-bold text-4xl text-[#0f172a] mb-2'>{type === 'login'? 'Login' : 'Create Account'}</h1>
                { type === 'register' &&
                  <input type="text" name="name" value={form.name} onChange={handleChange} placeholder='Username' className={inputStyle}/>
                }
                <input type="email" name="email" value={form.email} onChange={handleChange} placeholder={type === 'login' ? 'Enter your email here' : 'you@example.com'} className={inputStyle}/>
                <input type="password" name="password" value={form.password} onChange={handleChange} placeholder='Password' className={inputStyle}/>
                { type === 'register' &&
                  <input type='tel' name="phone" value={form.phone} onChange={handleChange} placeholder='Phone number' className={inputStyle}/>
                }
                <button type='submit' disabled={loading} className='border border-black w-full p-2.5 rounded-xl bg-[#2563eb] text-[#fafafa] active:bg-[#1a5cea]'>{type === 'login' ? 'Login →' : 'Create account →'}</button>
                <p>{type === 'login' ? "Don't have an account?" : 'Already existing user?'} <span className='cursor-pointer text-[#1d55ce] hover:underline' onClick={()=> type === 'login'? navigate('/register'):navigate('/login')}>{type === 'login' ? 'Click here' : 'Login here' }</span> </p>
            </form>
        </div>
        <div className='basis-[44%] bg-[#cfdfeee3] rounded-[4rem] flex flex-col justify-center items-center'>
            <img src={printer} alt="" className='w-3/4'/>
            <h2 className='text-xl font-medium text-[#0f172a] tracking-wide'>Print from you Home</h2>
            <p className='text-wrap w-4/5 text-center text-[#475569]'>Place your order from anywhere and get your preferred service</p>
        </div>
      </div>
    </div>
  )
}

export default AuthPage
