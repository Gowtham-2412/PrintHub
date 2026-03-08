import React from 'react'
import { ChartColumnIcon, LayoutDashboard, ListChecksIcon } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: ChartColumnIcon },
  { to: '/admin/manage', label: 'Services', icon: LayoutDashboard },
  { to: '/admin/orders', label: 'Orders', icon: ListChecksIcon }
]

const Navigation = ({ onNavigate }) => {
  return (
    <nav className='space-y-2'>
      {navItems.map((item) => {
        const Icon = item.icon

        return (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={({ isActive }) =>
              [
                'flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'border-sky-400 bg-sky-500/15 text-sky-100'
                  : 'border-slate-700 text-slate-200 hover:border-slate-500 hover:bg-slate-800/80'
              ].join(' ')
            }
          >
            <Icon size={18} />
            <span>{item.label}</span>
          </NavLink>
        )
      })}
    </nav>
  )
}

export default Navigation
