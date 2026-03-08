import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import SideBar from './SideBar'
import { Menu, X } from 'lucide-react'

const AdminPage = () => {
  const { user, loading, logout } = useContext(AuthContext)
  const [isSidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setSidebarOpen(false)
  }, [location.pathname])

  if (loading) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-slate-100'>
        <div className='h-10 w-10 animate-spin rounded-full border-4 border-sky-600 border-t-transparent' />
      </div>
    )
  }

  if (!user) return <Navigate to='/login' replace />

  const handleLogout = () => {
    setSidebarOpen(false)
    logout()
  }

  return (
    <div className='flex min-h-screen bg-slate-100'>
      <aside className='hidden w-72 shrink-0 border-r border-slate-200 bg-slate-900 md:flex'>
        <SideBar user={user} onLogout={handleLogout} />
      </aside>

      {isSidebarOpen && (
        <button
          type='button'
          aria-label='Close sidebar backdrop'
          className='fixed inset-0 z-30 bg-black/35 md:hidden'
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={[
          'fixed inset-y-0 left-0 z-40 w-72 transform border-r border-slate-700 bg-slate-900 shadow-xl transition-transform duration-300 md:hidden',
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        ].join(' ')}
      >
        <SideBar user={user} onNavigate={() => setSidebarOpen(false)} onLogout={handleLogout} />
      </aside>

      <main className='flex min-w-0 flex-1 flex-col'>
        <header className='sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 md:hidden'>
          <button
            type='button'
            onClick={() => setSidebarOpen((prev) => !prev)}
            className='rounded-lg p-2 text-slate-700 hover:bg-slate-100'
            aria-label={isSidebarOpen ? 'Close menu' : 'Open menu'}
          >
            {isSidebarOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
          <h1 className='text-lg font-semibold text-slate-900'>Admin Panel</h1>
          <div className='w-9' />
        </header>

        <section className='flex-1 p-4 md:p-8'>
          <Outlet />
        </section>
      </main>
    </div>
  )
}

export default AdminPage
