import React from 'react'
import HeroCard from '../components/HeroCard'
import xeroxsvg from '../../assets/xeroxmachine.svg'
import { ChevronDown } from 'lucide-react'

const Hero = () => {
  return (
    <section className='min-h-[85vh] bg-gradient-to-br from-[#2655bb36] from-25% to-[#ebedef] to-75% flex flex-col justify-center'>
      <div className='w-[90%] md:w-[85%] max-w-7xl mx-auto py-10 md:py-14'>
        <div className='grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 md:gap-10 items-center'>
          <div className='text-center lg:text-left'>
            <h1 className='text-4xl md:text-6xl text-[#0f172a] font-bold leading-tight'>
              Skip the Queue, <br />
              <span className='text-[#2858c0]'>Print Smarter</span>
            </h1>
            <p className='text-[#475569] font-medium text-lg mt-6 max-w-2xl mx-auto lg:mx-0'>
              Your neighborhood service shop, now in the cloud.
              Upload, track, and manage your stationery needs with
              real-time updates and instant processing.
            </p>
          </div>

          <div className='w-full grid grid-cols-2 gap-3 sm:gap-4 md:gap-5'>
            <HeroCard image={xeroxsvg} serviceName='B/W Xerox' />
            <HeroCard image={xeroxsvg} serviceName='Color Xerox' />
            <HeroCard image={xeroxsvg} serviceName='ID Print' />
            <HeroCard image={xeroxsvg} serviceName='Passport Print' />
          </div>
        </div>
      </div>

      <a
        onClick={() => document.getElementById('services').scrollIntoView({ behavior: 'smooth' })}
        className='group mx-auto w-fit flex flex-col items-center cursor-pointer hover:-translate-y-2 transition-all ease-linear mt-4 md:mt-6'
      >
        <p>Explore More</p>
        <ChevronDown />
        <div className='h-1.5 w-28 my-2 bg-[#0000001a] rounded-[50%] group-hover:scale-125 transition-transform ease-linear duration-300' />
      </a>
    </section>
  )
}

export default Hero
