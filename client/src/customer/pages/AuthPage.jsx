import React, { useContext, useState } from 'react'
import printer from '../../assets/printer.svg'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import { toast } from 'react-hot-toast'

const AuthPage = ({ type }) => {
  const navigate = useNavigate()
  const { login, register } = useContext(AuthContext)

  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (type === 'login') {
        const response = await login(form.email, form.password)
        toast.success(`Welcome back, ${response.name}`)
        navigate('/')
      } else {
        if (!form.name || !form.email || !form.password || !form.phone) {
          toast.error('Please fill all the fields!')
          setLoading(false)
          return
        }

        const response = await register(form)
        toast.success(`Account created for ${response.name}`)
        navigate('/')
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Authentication failed!'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = 'h-11 sm:w-full w-4/5 rounded-2xl p-3 text-[#475569] shadow placeholder:text-sm focus:outline-none'

  return (
    <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-[#688ee0] from-50% to-[#b8c3dd] to-30% p-4 sm:p-6 md:p-8'>
      <div className='flex w-full max-w-5xl flex-col overflow-hidden rounded-3xl bg-[#ebedefe3] p-3 shadow-lg md:min-h-[75vh] md:flex-row md:rounded-[3rem]'>
        <div className='flex flex-1'>
          <form onSubmit={handleSubmit} className='mx-auto flex w-full max-w-md flex-col justify-center items-center gap-4 px-2 py-4 sm:px-4 md:gap-5 md:px-0'>
            <h1 className='mb-1 text-center text-3xl font-bold text-[#0f172a] sm:text-4xl md:mb-2 md:text-left'>
              {type === 'login' ? 'Login' : 'Create Account'}
            </h1>

            {type === 'register' && (
              <input
                type='text'
                name='name'
                value={form.name}
                onChange={handleChange}
                placeholder='Username'
                className={inputStyle}
              />
            )}

            <input
              type='email'
              name='email'
              value={form.email}
              onChange={handleChange}
              placeholder={type === 'login' ? 'Enter your email here' : 'you@example.com'}
              className={inputStyle}
            />

            <input
              type='password'
              name='password'
              value={form.password}
              onChange={handleChange}
              placeholder='Password'
              className={inputStyle}
            />

            {type === 'register' && (
              <input
                type='tel'
                name='phone'
                value={form.phone}
                onChange={handleChange}
                placeholder='Phone number'
                className={inputStyle}
              />
            )}

            <button
              type='submit'
              disabled={loading}
              className='w-full rounded-xl border border-black bg-[#2563eb] p-2.5 text-[#fafafa] active:bg-[#1a5cea]'
            >
              {type === 'login' ? 'Login→' : 'Create account→'}
            </button>

            <p className='text-center md:text-left'>
              {type === 'login' ? "Don't have an account?" : 'Already existing user?'}{' '}
              <span
                className='cursor-pointer text-[#1d55ce] hover:underline'
                onClick={() => (type === 'login' ? navigate('/register') : navigate('/login'))}
              >
                {type === 'login' ? 'Click here' : 'Login here'}
              </span>
            </p>
          </form>
        </div>

        <div className='hidden flex-1 flex-col items-center justify-center rounded-[2.25rem] bg-[#cfdfeee3] p-6 md:flex'>
          <img src={printer} alt='Printer illustration' className='w-3/4 max-w-xs' />
          <h2 className='text-center text-lg font-medium tracking-wide text-[#0f172a] lg:text-xl'>
            Print from your Home
          </h2>
          <p className='w-4/5 text-center text-[#475569]'>
            Place your order from anywhere and get your preferred service
          </p>
        </div>
      </div>
    </div>
  )
}

export default AuthPage
