import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import api from '../services/AxiosSetup'
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts'
import {
  DollarSign,
  ShoppingBag,
  Clock,
  CheckCircle,
  TrendingUp,
  Package,
  Calendar
} from 'lucide-react'

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

const DashBoard = () => {
  const { user } = useContext(AuthContext)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    revenueData: [],
    statusData: []
  })

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await api.get('/order/all-orders')
        processData(Array.isArray(response.data) ? response.data : [])
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [])

  const processData = (orders) => {
    const totalOrders = orders.length
    const pendingOrders = orders.filter((o) => o.status === 'pending').length
    const completedOrders = orders.filter((o) => o.status === 'completed').length

    const totalRevenue = orders
      .filter((o) => o.status === 'completed')
      .reduce((acc, curr) => acc + (Number(curr.totalAmount) || 0), 0)

    const statusCounts = orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1
      return acc
    }, {})

    const statusData = Object.keys(statusCounts).map((status) => ({
      name: status.charAt(0).toUpperCase() + status.slice(1),
      value: statusCounts[status]
    }))

    const sortedOrders = [...orders].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    const revenueMap = new Map()

    sortedOrders.forEach((order) => {
      if (order.status === 'completed') {
        const date = new Date(order.createdAt).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric'
        })
        revenueMap.set(date, (revenueMap.get(date) || 0) + (Number(order.totalAmount) || 0))
      }
    })

    const revenueData = Array.from(revenueMap, ([date, amount]) => ({ date, amount }))

    setStats({
      totalRevenue,
      totalOrders,
      pendingOrders,
      completedOrders,
      revenueData,
      statusData
    })
  }

  return (
    <div className='mx-auto w-full max-w-7xl'>
      <div className='mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight text-slate-900 md:text-3xl'>Dashboard</h1>
          <p className='mt-1 text-sm text-slate-500 md:text-base'>
            {`Welcome${user?.name ? `, ${user.name}` : ''}. Overview of your business performance.`}
          </p>
        </div>
        <div className='flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm'>
          <Calendar size={16} className='text-blue-500' />
          <span className='hidden sm:inline'>
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </span>
          <span className='sm:hidden'>
            {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
        </div>
      </div>

      {loading ? (
        <div className='flex h-96 items-center justify-center'>
          <div className='h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent' />
        </div>
      ) : (
        <div className='space-y-6 md:space-y-8'>
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-6'>
            <StatCard
              icon={<DollarSign size={24} />}
              title='Total Revenue'
              value={`Rs ${stats.totalRevenue.toLocaleString()}`}
              colorBg='bg-emerald-100'
              colorText='text-emerald-600'
            />
            <StatCard
              icon={<ShoppingBag size={24} />}
              title='Total Orders'
              value={stats.totalOrders}
              colorBg='bg-blue-100'
              colorText='text-blue-600'
            />
            <StatCard
              icon={<Clock size={24} />}
              title='Pending Orders'
              value={stats.pendingOrders}
              colorBg='bg-amber-100'
              colorText='text-amber-600'
            />
            <StatCard
              icon={<CheckCircle size={24} />}
              title='Completed Orders'
              value={stats.completedOrders}
              colorBg='bg-violet-100'
              colorText='text-violet-600'
            />
          </div>

          <div className='grid grid-cols-1 gap-6 lg:grid-cols-2 md:gap-8'>
            <div className='rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-md'>
              <div className='mb-6'>
                <h3 className='flex items-center gap-2 text-lg font-bold text-slate-800'>
                  <TrendingUp size={20} className='text-blue-500' />
                  Revenue Trends
                </h3>
                <p className='mt-1 text-sm text-slate-500'>Daily revenue performance</p>
              </div>
              <div className='h-72 w-full md:h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <AreaChart data={stats.revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id='colorRevenue' x1='0' y1='0' x2='0' y2='1'>
                        <stop offset='5%' stopColor='#3b82f6' stopOpacity={0.1} />
                        <stop offset='95%' stopColor='#3b82f6' stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray='3 3' vertical={false} stroke='#f1f5f9' />
                    <XAxis
                      dataKey='date'
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#64748b', fontSize: 12 }}
                      dy={10}
                      minTickGap={30}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#64748b', fontSize: 12 }}
                      tickFormatter={(value) => `Rs ${value}`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        borderRadius: '12px',
                        border: 'none',
                        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                      }}
                      itemStyle={{ color: '#1e293b', fontWeight: 600 }}
                      formatter={(value) => [`Rs ${value}`, 'Revenue']}
                    />
                    <Area
                      type='monotone'
                      dataKey='amount'
                      stroke='#3b82f6'
                      strokeWidth={3}
                      fillOpacity={1}
                      fill='url(#colorRevenue)'
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className='flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-md'>
              <div className='mb-6'>
                <h3 className='flex items-center gap-2 text-lg font-bold text-slate-800'>
                  <Package size={20} className='text-purple-500' />
                  Order Status
                </h3>
                <p className='mt-1 text-sm text-slate-500'>Distribution of order statuses</p>
              </div>
              <div className='relative min-h-[300px] flex-1'>
                <ResponsiveContainer width='100%' height='100%'>
                  <PieChart>
                    <Pie
                      data={stats.statusData}
                      cx='50%'
                      cy='50%'
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey='value'
                    >
                      {stats.statusData.map((entry, index) => (
                        <Cell key={`${entry.name}-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        borderRadius: '12px',
                        border: 'none',
                        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                      }}
                      itemStyle={{ color: '#1e293b' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className='pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center'>
                  <p className='text-3xl font-bold text-slate-800'>{stats.totalOrders}</p>
                  <p className='text-xs font-medium uppercase tracking-wider text-slate-500'>Total</p>
                </div>
              </div>
              <div className='mt-4 grid grid-cols-2 gap-3'>
                {stats.statusData.map((entry, index) => (
                  <div
                    key={`${entry.name}-legend`}
                    className='group flex cursor-default items-center justify-between rounded-lg p-2 text-sm transition-colors hover:bg-slate-50'
                  >
                    <div className='flex items-center gap-2'>
                      <div
                        className='h-3 w-3 rounded-full'
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span className='font-medium text-slate-600'>{entry.name}</span>
                    </div>
                    <span className='font-bold text-slate-900'>{entry.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const StatCard = ({ icon, title, value, colorBg, colorText }) => (
  <div className='group relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg'>
    <div className='relative z-10 flex items-center justify-between'>
      <div>
        <p className='mb-1 text-sm font-medium text-slate-500'>{title}</p>
        <h3 className='text-2xl font-bold text-slate-800 transition-colors group-hover:text-blue-600'>{value}</h3>
      </div>
      <div className={`rounded-xl p-3 transition-transform duration-300 group-hover:scale-110 ${colorBg} ${colorText}`}>
        {icon}
      </div>
    </div>
    <div className={`absolute -bottom-4 -right-4 h-24 w-24 rounded-full opacity-20 transition-transform duration-500 ease-out group-hover:scale-150 ${colorBg}`} />
  </div>
)

export default DashBoard
