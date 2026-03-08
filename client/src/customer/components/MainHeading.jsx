import React from 'react'

const MainHeading = ({ first, last }) => {
  return (
    <div className='my-2 py-1.5'>
      <h1 className='text-center text-4xl font-bold'>{first} <span className='text-[#2858c0]'>{last}</span></h1>
    </div>
  )
}

export default MainHeading
