import React from 'react'
import MainHeading from '../components/MainHeading'

const Procedure = () => {
  return (
    <section className='py-10'>
        <MainHeading first='Steps to get' last='your work done' />
        <hr className='h-[1.6px] bg-black w-3/5 mx-auto'/>
        <div className='w-4/5 mx-auto my-10 py-3'>
            <ul className='list-disc list-inside space-y-6 text-lg font-medium font-noto'>
                <li>Login/Create Account with your details</li>
                <li>Explore the services we provide</li>
                <li>Select the service you need and fill the details in repective forms and add the items to the cart</li>
                <li>Check your cart for confirmation and place your order</li>
                <li>Go and collect your collect your order from the shop after payment verification</li>
            </ul>
        </div>
    </section>
  )
}

export default Procedure
