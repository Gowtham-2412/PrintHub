import React, { useEffect, useState } from 'react'
import api from '../services/AxiosSetup'
import { FileText, Calendar, Clock, User, Printer } from 'lucide-react'
import toast from 'react-hot-toast'
import printJS from 'print-js'

const Orders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [pricingDrafts, setPricingDrafts] = useState({})

  const fetchOrders = async () => {
    try {
      const response = await api.get('/order/all-orders')
      const orderList = Array.isArray(response.data) ? response.data : []
      setOrders(orderList)
      setPricingDrafts(
        orderList.reduce((acc, order) => {
          acc[order._id] = String(order.totalAmount || 0)
          return acc
        }, {})
      )
    } catch (error) {
      console.error(error)
      toast.error('Failed to fetch orders')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const response = await api.patch(`/order/${orderId}/status`, { status: newStatus })
      toast.success(`Order status updated to ${newStatus}`)
      setOrders((prev) =>
        prev.map((order) => (order._id === orderId ? response.data : order))
      )
    } catch (error) {
      console.error(error)
      toast.error('Failed to update status')
    }
  }

  const handlePricingUpdate = async (orderId) => {
    const amount = Number(pricingDrafts[orderId])

    if (!Number.isFinite(amount) || amount < 0) {
      toast.error('Enter a valid total amount')
      return
    }

    try {
      const response = await api.patch(`/order/${orderId}/pricing`, { totalAmount: amount })
      toast.success('Final amount updated')
      setOrders((prev) =>
        prev.map((order) => (order._id === orderId ? response.data : order))
      )
    } catch (error) {
      console.error(error)
      toast.error('Failed to update amount')
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'accepted':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'in-progress':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200'
    }
  }

  const handlePrint = (url, mimeType) => {
    if (!url) {
      toast.error('File URL is missing')
      return
    }

    if (mimeType?.includes('image')) {
      printJS({ printable: url, type: 'image' })
    } else {
      window.open(url, '_blank')
    }
  }

  return (
    <div className='mx-auto w-full max-w-7xl'>
      <div className='mb-8'>
        <h1 className='text-2xl font-bold text-slate-900 md:text-3xl'>Manage Orders</h1>
        <p className='mt-1 text-sm text-slate-500'>Track order status, review files, and finalize payable amount.</p>
      </div>

      {loading ? (
        <div className='flex h-64 items-center justify-center'>
          <div className='h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent' />
        </div>
      ) : (
        <div className='space-y-6'>
          {orders.map((order) => (
            <div key={order._id} className='rounded-2xl border border-slate-200 bg-white p-6 shadow-sm'>
              <div className='flex flex-col justify-between gap-6 lg:flex-row'>
                <div className='flex-1'>
                  <div className='mb-4 flex flex-wrap items-center gap-4'>
                    <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600'>
                      <FileText size={24} />
                    </div>
                    <div>
                      <h3 className='text-lg font-bold text-slate-900'>{order.serviceType}</h3>
                      <p className='text-sm font-medium text-slate-500'>ID: {order._id}</p>
                    </div>
                    <div
                      className={`rounded-full border px-3 py-1 text-xs font-bold capitalize ${getStatusColor(order.status)}`}
                    >
                      {order.status}
                    </div>
                    <div className={`rounded-full border px-3 py-1 text-xs font-bold ${(order.priceFinalized || Number(order.totalAmount || 0) > 0) ? 'bg-green-100 text-green-800 border-green-200' : 'bg-amber-100 text-amber-800 border-amber-200'}`}>
                      {(order.priceFinalized || Number(order.totalAmount || 0) > 0) ? 'Amount finalized' : 'Amount pending'}
                    </div>
                  </div>

                  <div className='grid grid-cols-1 gap-4 text-sm text-slate-600 md:grid-cols-2'>
                    <div className='flex items-center gap-2'>
                      <User size={16} className='text-slate-400' />
                      <span className='font-semibold'>{order.customer?.name || 'Unknown User'}</span>
                    </div>
                    <div className='flex items-center gap-2'>
                      <Calendar size={16} className='text-slate-400' />
                      <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                      <Clock size={16} className='ml-2 text-slate-400' />
                      <span>
                        {new Date(order.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    <div>
                      <span className='text-slate-400'>Copies:</span>{' '}
                      <span className='font-bold'>{order.copies}</span>
                    </div>
                    <div>
                      <span className='text-slate-400'>Final Total:</span>{' '}
                      <span className='font-bold'>
                        {(order.priceFinalized || Number(order.totalAmount || 0) > 0) ? `Rs ${Number(order.totalAmount || 0).toLocaleString()}` : 'Pending'}
                      </span>
                    </div>
                    <div>
                      <span className='text-slate-400'>Service rate:</span>{' '}
                      <span className='font-bold'>Rs {Number(order.unitPrice || 0).toLocaleString()} / {order.pricingUnit}</span>
                    </div>
                  </div>

                  {order.instructions && (
                    <div className='mt-4 rounded-xl bg-slate-50 p-3 text-sm text-slate-700'>
                      <span className='font-bold text-slate-900'>Instructions:</span> {order.instructions}
                    </div>
                  )}
                </div>

                <div className='flex min-w-[260px] flex-col justify-between gap-4'>
                  <div className='flex w-full flex-col gap-2'>
                    <label className='text-xs font-bold uppercase text-slate-500'>Update Status</label>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                      className='w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-sm font-medium outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                    >
                      <option value='pending'>Pending</option>
                      <option value='accepted'>Accepted</option>
                      <option value='in-progress'>In Progress</option>
                      <option value='completed'>Completed</option>
                      <option value='rejected'>Rejected</option>
                    </select>
                  </div>

                  <div className='flex w-full flex-col gap-2'>
                    <label className='text-xs font-bold uppercase text-slate-500'>Finalize Total Amount</label>
                    <div className='flex gap-2'>
                      <input
                        type='number'
                        min='0'
                        value={pricingDrafts[order._id] ?? ''}
                        onChange={(e) => setPricingDrafts((prev) => ({ ...prev, [order._id]: e.target.value }))}
                        className='w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-sm font-medium outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                        placeholder='Enter total amount'
                      />
                      <button
                        type='button'
                        onClick={() => handlePricingUpdate(order._id)}
                        className='rounded-xl bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700'
                      >
                        Save
                      </button>
                    </div>
                  </div>

                  {order.file && order.file.length > 0 && (
                    <div className='w-full'>
                      <p className='mb-2 text-xs font-bold uppercase text-slate-500'>Files</p>
                      <div className='flex flex-col gap-2'>
                        {order.file.map((f, idx) => (
                          <div key={`${order._id}-file-${idx}`} className='flex items-center gap-2'>
                            <a
                              href={f.url}
                              target='_blank'
                              rel='noopener noreferrer'
                              className='flex flex-1 items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-sm text-blue-600 transition-colors hover:bg-blue-100 hover:underline'
                            >
                              <FileText size={14} />
                              <span className='max-w-[160px] truncate'>{f.originalName}</span>
                            </a>
                            <button
                              type='button'
                              onClick={() => handlePrint(f.url, f.mimeType)}
                              disabled={!f.url}
                              className='rounded-lg bg-slate-100 p-2 text-slate-600 transition-colors hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50'
                              title={f.url ? 'Print File' : 'File URL is missing, cannot print'}
                            >
                              <Printer size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {orders.length === 0 && (
            <div className='rounded-2xl border border-slate-200 bg-white py-20 text-center'>
              <p className='font-medium text-slate-500'>No orders found</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Orders
