import { MailIcon, MapPinIcon, PhoneIcon } from 'lucide-react'
import React from 'react'

const Footer = () => {
  return (
    <footer className='bg-[#000000b6] min-h-[40vh] py-10' id='contact'>
      <div className='w-full md:w-3/4 h-full mx-auto flex flex-col md:flex-row justify-center md:justify-between items-center gap-10 md:gap-0'>
        <div className='flex flex-col justify-center items-center md:items-start gap-6 text-white tracking-wide'>
          <p className='flex justify-center items-center gap-3'>
            <PhoneIcon fill='white'/>
            <span className='group'>
              +91 9782357274
            </span>
          </p>
          <p className='flex justify-center items-center gap-3'>
            <MailIcon/>
            <span className='group'>
              printhub.org@gmail.com
            </span>
          </p>
        </div>
        <div className='flex flex-col gap-4 text-center md:text-left'>
          <div className='flex flex-col md:flex-row justify-center items-center md:justify-start md:items-start gap-3 text-white tracking-wide'>
            <MapPinIcon color='white'/>
            <p className='w-full md:w-3/5'>
              23/420, Alankar Center, Mulapet, Nellore,
              Andhra Pradesh, India, 524003
            </p>
          </div>
          <p className='text-[#ffffffba] text-sm mt-4'>
            Copyright @2026 Printhub Org
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer;
