import React, { useEffect, useState } from 'react'
import Header from '../sections/Header'
import api from '../../services/AxiosSetup'
import { FileText, Calendar, Clock } from 'lucide-react'

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get('/order/my-orders')
        setOrders(response.data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [])

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-50 border-yellow-100'
      case 'accepted': return 'text-blue-600 bg-blue-50 border-blue-100'
      case 'in-progress': return 'text-purple-600 bg-purple-50 border-purple-100'
      case 'completed': return 'text-green-600 bg-green-50 border-green-100'
      case 'rejected': return 'text-red-600 bg-red-50 border-red-100'
      default: return 'text-slate-600 bg-slate-50 border-slate-100'
    }
  }

  return (
    <div className='min-h-screen bg-[#ebedef]'>
      <Header />
      <div className='max-w-6xl mx-auto p-4 md:p-8 pt-10'>
        <h1 className='text-4xl font-bold text-[#0f172a] mb-8'>My Orders</h1>

        {loading ? (
          <div className='text-center py-20'>
            <div className='animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto'></div>
          </div>
        ) : orders.length === 0 ? (
          <div className='text-center py-20 bg-white rounded-3xl shadow-sm'>
            <p className='text-xl text-slate-500 font-medium'>No orders found</p>
          </div>
        ) : (
          <div className='space-y-4'>
            {orders.map((order) => (
              <div key={order._id} className='bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-6'>
                <div className='flex-1'>
                  <div className='flex items-center gap-4 mb-4'>
                    <div className='w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600'>
                      <FileText size={24} />
                    </div>
                    <div>
                      <h3 className='text-lg font-bold text-[#0f172a]'>{order.serviceType}</h3>
                      <p className='text-sm text-slate-500 font-medium'>Order ID: {order._id}</p>
                    </div>
                  </div>

                  <div className='grid grid-cols-2 md:grid-cols-4 gap-4 text-sm'>
                    <div>
                      <p className='text-slate-400 font-medium mb-1'>Date</p>
                      <p className='text-slate-700 font-bold flex items-center gap-2'>
                        <Calendar size={16} /> {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className='text-slate-400 font-medium mb-1'>Time</p>
                      <p className='text-slate-700 font-bold flex items-center gap-2'>
                        <Clock size={16} /> {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <div>
                      <p className='text-slate-400 font-medium mb-1'>Copies</p>
                      <p className='text-slate-700 font-bold'>{order.copies}</p>
                    </div>
                    <div>
                      <p className='text-slate-400 font-medium mb-1'>Total</p>
                      <p className='text-slate-700 font-bold'>
                        {(order.priceFinalized || Number(order.totalAmount || 0) > 0) ? `Rs ${Number(order.totalAmount || 0).toLocaleString()}` : 'Pending admin review'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className='flex flex-col justify-between items-end gap-4'>
                  <span className={`px-4 py-2 rounded-full text-sm font-bold border ${getStatusColor(order.status)} capitalize`}>
                    {order.status}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${(order.priceFinalized || Number(order.totalAmount || 0) > 0) ? 'text-green-700 bg-green-50 border-green-100' : 'text-amber-700 bg-amber-50 border-amber-100'}`}>
                    {(order.priceFinalized || Number(order.totalAmount || 0) > 0) ? 'Amount finalized' : 'Amount pending'}
                  </span>
                  {order.file && order.file.length > 0 && (
                    <div className='text-sm text-slate-500 font-medium'>
                      {order.file.length} file(s) uploaded
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MyOrdersPage
