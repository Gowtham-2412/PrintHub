import React from 'react'
import MainHeading from '../components/MainHeading'
import ServiceCard from '../components/ServiceCard'
import printer from '../../assets/aiprinter.png'
import scanner from '../../assets/aiscanner.png'
import passphoto from '../../assets/aipassport.png'
import xerox from '../../assets/aixeroxmachine.png'
import id from '../../assets/aiid.png'

const Services = () => {
  return (
    <section className='pt-10' id='services'>
        <MainHeading first='Services'/>
        <hr className='h-[2px] bg-black w-4/5 md:w-3/5 mx-auto' />
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full px-4 md:w-3/4 m-auto py-6'>
          <ServiceCard image={xerox} description='Get B/W xerox on a high quality 70 GSM paper in wide variety of sizes'/>
          <ServiceCard image={printer} description='You will get high quality color print in various available sizes. Printed with Epson L360 inkjet printer'/>
          <ServiceCard image={id} description='Download and print Aadhar Card, Pan Card, or any other government issued documents'/>
          <ServiceCard image={scanner} description='Scan your documents offline with Epson printer scanner in high quality and store them safely as soft copies'/>
          <ServiceCard image={passphoto} description='Passport size photos 8/16 within few minutes'/>
        </div>
    </section>
  )
}

export default Services
