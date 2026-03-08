import React, { useEffect, useState } from 'react'
import api from '../services/AxiosSetup'
import { X, Plus, Pencil, Trash2 } from 'lucide-react'

const defaultFormData = { name: '', description: '', price: '', unit: 'per page', isActive: true }

const ManageServices = () => {
  const [serviceList, setServiceList] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState(defaultFormData)
  const [isEditing, setIsEditing] = useState(false)
  const [editId, setEditId] = useState(null)

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await api.get('/service')
        setServiceList(Array.isArray(response.data?.services) ? response.data.services : [])
      } catch (error) {
        console.error('Error fetching services:', error)
        setServiceList([])
      }
    }

    fetchServices()
  }, [])

  const handleDelete = async (id) => {
    try {
      await api.delete(`/service/${id}`)
      setServiceList((prev) => prev.filter((service) => service._id !== id))
    } catch (error) {
      console.error('Error deleting service:', error)
    }
  }

  const handleInputChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setFormData({ ...formData, [e.target.name]: value })
  }

  const openAddModal = () => {
    setFormData(defaultFormData)
    setIsEditing(false)
    setEditId(null)
    setShowModal(true)
  }

  const openEditModal = (service) => {
    setFormData({
      name: service.name,
      description: service.description,
      price: service.price,
      unit: service.unit || 'per page',
      isActive: service.isActive
    })
    setIsEditing(true)
    setEditId(service._id)
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      if (isEditing && editId) {
        const response = await api.put(`/service/${editId}`, {
          ...formData,
          price: Number(formData.price)
        })
        setServiceList((prev) => prev.map((item) => (item._id === editId ? response.data : item)))
      } else {
        const response = await api.post('/service/create', {
          ...formData,
          price: Number(formData.price)
        })
        setServiceList((prev) => [...prev, response.data])
      }

      setShowModal(false)
    } catch (error) {
      console.error(error.response?.data || error.message)
    }
  }

  return (
    <div className='mx-auto w-full max-w-7xl'>
      {showModal && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
          <div className='relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl md:p-8'>
            <button
              type='button'
              onClick={() => setShowModal(false)}
              className='absolute right-4 top-4 rounded-lg p-1 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700'
              aria-label='Close service modal'
            >
              <X size={20} />
            </button>

            <h2 className='mb-5 text-2xl font-bold text-slate-900'>
              {isEditing ? 'Edit Service' : 'Add New Service'}
            </h2>

            <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700'>Name</label>
                <input
                  type='text'
                  name='name'
                  value={formData.name}
                  onChange={handleInputChange}
                  className='mt-1 w-full rounded-lg border border-gray-300 p-2.5 outline-none transition-colors focus:border-blue-500'
                  required
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700'>Description</label>
                <textarea
                  name='description'
                  value={formData.description}
                  onChange={handleInputChange}
                  className='mt-1 w-full rounded-lg border border-gray-300 p-2.5 outline-none transition-colors focus:border-blue-500'
                  rows={4}
                  required
                />
              </div>

              <div className='flex flex-col gap-4 md:flex-row'>
                <div className='flex-1'>
                  <label className='block text-sm font-medium text-gray-700'>Price</label>
                  <input
                    type='number'
                    name='price'
                    value={formData.price}
                    onChange={handleInputChange}
                    className='mt-1 w-full rounded-lg border border-gray-300 p-2.5 outline-none transition-colors focus:border-blue-500'
                    min='0'
                    step='0.01'
                    required
                  />
                </div>

                <div className='flex-1'>
                  <label className='block text-sm font-medium text-gray-700'>Unit</label>
                  <select
                    name='unit'
                    value={formData.unit}
                    onChange={handleInputChange}
                    className='mt-1 w-full rounded-lg border border-gray-300 p-2.5 outline-none transition-colors focus:border-blue-500'
                  >
                    <option value='per page'>Per Page</option>
                    <option value='per set'>Per Set</option>
                    <option value='fixed'>Fixed</option>
                  </select>
                </div>
              </div>

              <div className='flex items-center gap-2'>
                <input
                  type='checkbox'
                  id='isActive'
                  name='isActive'
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  className='h-4 w-4 text-blue-600'
                />
                <label htmlFor='isActive' className='text-sm font-medium text-gray-700'>
                  Active
                </label>
              </div>

              <button
                type='submit'
                className='rounded-lg bg-blue-600 py-2.5 font-medium text-white transition-colors hover:bg-blue-700'
              >
                {isEditing ? 'Update Service' : 'Add Service'}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className='mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center'>
        <div>
          <h1 className='text-2xl font-bold text-slate-900 md:text-3xl'>Manage Services</h1>
          <p className='mt-1 text-sm text-slate-500'>Create, edit, and control your active service catalog.</p>
        </div>

        <button
          type='button'
          onClick={openAddModal}
          className='inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white transition-colors hover:bg-blue-700'
        >
          <Plus size={18} />
          Add Service
        </button>
      </div>

      <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
        {serviceList.map((service) => (
          <div key={service._id} className='rounded-xl border min-w-fit border-gray-200 bg-white p-5 shadow-sm'>
            <div className='flex items-start justify-between gap-3'>
              <h2 className='text-xl font-semibold text-gray-800'>{service.name}</h2>
              <span
                className={[
                  'rounded-full px-2.5 py-1 text-xs font-semibold',
                  service.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                ].join(' ')}
              >
                {service.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>

            <p className='mt-3 line-clamp-3 text-sm text-gray-600'>{service.description}</p>

            <div className='mt-4 flex items-center justify-between'>
              <span className='text-lg font-bold text-blue-600'>
                Rs {Number(service.price || 0).toLocaleString()}{' '}
                <span className='text-sm font-normal text-gray-500'>/ {service.unit}</span>
              </span>
              <div className='flex items-center gap-2'>
                <button
                  type='button'
                  onClick={() => openEditModal(service)}
                  className='inline-flex items-center gap-1 rounded-lg bg-gray-100 px-3 py-1.5 text-sm text-gray-700 transition-colors hover:bg-gray-200'
                >
                  <Pencil size={14} />
                  Edit
                </button>
                <button
                  type='button'
                  onClick={() => handleDelete(service._id)}
                  className='inline-flex items-center gap-1 rounded-lg bg-red-50 px-3 py-1.5 text-sm text-red-600 transition-colors hover:bg-red-100'
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}

        {serviceList.length === 0 && (
          <div className='col-span-full rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center'>
            <p className='italic text-gray-500'>No services found. Add your first service to get started.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ManageServices
