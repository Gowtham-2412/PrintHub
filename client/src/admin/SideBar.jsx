import React from 'react'
import Navigation from './Navigation'
import profile from '../assets/sampleprofile.jpg'
import { LogOut } from 'lucide-react'

const SideBar = ({ user, onNavigate, onLogout }) => {
  return (
    <aside className='flex h-full w-full flex-col bg-slate-900 p-5 text-slate-100'>
      <div className='mb-6 flex items-center gap-3 rounded-2xl border border-slate-700 bg-slate-800/60 p-3'>
        <img src={profile} alt='Admin profile' className='h-14 w-14 rounded-full object-cover' />
        <div className='flex flex-col'>
          <h5 className='font-semibold text-slate-100'>{user?.name || 'Admin User'}</h5>
          <p className='text-xs text-slate-300'>View details {'->'}</p>
        </div>
      </div>

      <Navigation onNavigate={onNavigate} />

      <button
        type='button'
        onClick={onLogout}
        className='mt-auto inline-flex items-center justify-center gap-2 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-200 transition-colors hover:bg-red-500/20'
      >
        <LogOut size={16} />
        Logout
      </button>
    </aside>
  )
}

export default SideBar
