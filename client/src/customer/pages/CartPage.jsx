import React, { useContext, useState } from 'react'
import Header from '../sections/Header'
import { CartContext } from '../../context/CartContet'
import { Trash2, FileText, ArrowRight, Loader } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import api from '../../services/AxiosSetup'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const CartPage = () => {
  const { cartItems, removeFromCart, clearCart } = useContext(CartContext)
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const navigate = useNavigate()

  const handleCheckout = async () => {
    if (cartItems.length === 0) return
    setIsCheckingOut(true)

    try {
      const promises = cartItems.map((item) => {
        const formData = new FormData()
        formData.append('serviceId', item.serviceId)

        if (item.files && item.files.length > 0) {
          item.files.forEach((file) => {
            formData.append('files', file)
          })
        } else if (item.file) {
          formData.append('files', item.file)
        }

        formData.append('instructions', item.instructions || '')
        formData.append('copies', item.copies || 1)

        return api.post('/order/create', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
      })

      await Promise.all(promises)

      toast.success('All orders placed successfully!')
      clearCart()
      navigate('/my-orders')
    } catch (error) {
      console.error(error)
      toast.error('Failed to place some orders. Please try again.')
    } finally {
      setIsCheckingOut(false)
    }
  }

  return (
    <div className='min-h-screen bg-[#ebedef]'>
      <Header />
      <div className='max-w-6xl mx-auto p-4 md:p-8 pt-10'>
        <h1 className='text-4xl font-bold text-[#0f172a] mb-8'>Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <div className='text-center py-20 bg-white rounded-3xl shadow-sm'>
            <p className='text-xl text-slate-500 font-medium'>Your cart is empty</p>
            <button onClick={() => navigate('/')} className='mt-4 text-blue-600 hover:underline font-medium'>Go to Services</button>
          </div>
        ) : (
          <div className='flex flex-col lg:flex-row gap-8'>
            <div className='flex-1 space-y-4'>
              <AnimatePresence>
                {cartItems.map((item) => (
                  <motion.div
                    key={item.cartItemId}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    className='bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-start gap-4'
                  >
                    <div className='w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shrink-0'>
                      <FileText size={32} />
                    </div>
                    <div className='flex-1'>
                      <div className='flex justify-between items-start'>
                        <h3 className='text-xl font-bold text-[#0f172a]'>{item.serviceName}</h3>
                        <button
                          onClick={() => removeFromCart(item.cartItemId)}
                          className='text-slate-400 hover:text-red-500 transition-colors p-1'
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                      <p className='text-slate-500 text-sm mt-1 font-medium'>
                        {item.files && item.files.length > 0
                          ? `${item.files.length} file(s) selected`
                          : item.file
                            ? item.file.name
                            : 'No file selected'}
                      </p>
                      <div className='flex flex-wrap gap-2 mt-4 text-sm text-slate-600 font-medium'>
                        <span className='bg-slate-100 px-3 py-1 rounded-full'>
                          {item.copies} {item.copies > 1 ? 'Copies' : 'Copy'}
                        </span>
                        {item.instructions && (
                          <span className='bg-slate-100 px-3 py-1 rounded-full truncate max-w-[200px]'>
                            {item.instructions}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className='text-right self-center'>
                      <p className='text-sm font-bold text-[#0f172a]'>Price after admin review</p>
                      <p className='text-xs text-slate-400 font-medium'>Rate: Rs {item.price} / {item.unit}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className='lg:w-96 shrink-0'>
              <div className='bg-white p-6 rounded-3xl shadow-sm border border-slate-100 sticky top-24'>
                <h2 className='text-2xl font-bold text-[#0f172a] mb-6'>Summary</h2>
                <div className='space-y-3 mb-6 font-medium'>
                  <div className='flex justify-between text-slate-600'>
                    <span>Total orders</span>
                    <span>{cartItems.length}</span>
                  </div>
                  <div className='h-px bg-slate-100 my-2' />
                  <div className='text-sm text-slate-500'>
                    Final payable amount will be set by admin after checking uploaded files.
                  </div>
                </div>
                <button
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  className='w-full bg-[#2563eb] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-[#1d4ed8] transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-blue-200'
                >
                  {isCheckingOut ? (
                    <Loader className='animate-spin' />
                  ) : (
                    <>
                      Checkout <ArrowRight size={20} />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CartPage
