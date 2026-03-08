import React from 'react'

const ServiceCard = ({ image, description }) => {
  return (
    <div className='group relative flex h-64 flex-col items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-10 shadow-sm transition-transform duration-300 ease-out hover:scale-[1.02] hover:border-sky-200'>
      <img
        src={image}
        alt=''
        className='h-auto w-full p-5 transition-opacity duration-500 ease-in-out group-hover:opacity-30'
      />
      <div className='absolute top-full flex h-0 w-full items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-sky-600/95 via-blue-600/95 to-indigo-600/95 transition-all duration-300 ease-in-out group-hover:top-0 group-hover:h-full'>
        <p className='w-4/5 text-center text-lg text-slate-50'>{description}</p>
      </div>
    </div>
  )
}

export default ServiceCard
