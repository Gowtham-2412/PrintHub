import React from 'react'
import { ArrowUpRight } from 'lucide-react'

const HeroCard = ({ image, serviceName }) => {
  return (
    <article className='group relative h-32 sm:h-36 overflow-hidden rounded-2xl border border-slate-200 bg-white p-3 sm:p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg'>

      <div className='mt-1 flex h-full items-center gap-3'>
        <div className='flex aspect-square w-20 shrink-0 items-center justify-center rounded-xl bg-blue-50 ring-1 ring-blue-100 sm:w-24'>
          <img
            src={image}
            alt={serviceName}
            className='w-full object-contain transition-transform duration-300 group-hover:scale-110 sm:w-full'
          />
        </div>

        <div className='min-w-0 flex-1'>
          <p className='truncate text-sm font-semibold text-slate-800 sm:text-base'>{serviceName}</p>
        </div>
      </div>
    </article>
  )
}

export default HeroCard
