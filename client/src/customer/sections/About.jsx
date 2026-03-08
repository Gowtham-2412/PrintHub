import React from 'react'
import MainHeading from '../components/MainHeading'

const About = () => {
    return (
        <section>
            <div className='w-full px-4 md:w-4/5 mx-auto pt-10 max-w-4xl'>
                <MainHeading first='About' last='Us' />
                <hr className='h-[2px] bg-black w-3/4 mx-auto' />
                <p className='py-10 w-full md:w-[90%] mx-auto text-base md:text-lg leading-relaxed md:leading-10'>
                    We are a local service station focused on providing reliable printing, photocopying, and digital services for students, professionals, and small businesses. Our goal is to make everyday tasks like Xerox, color printing, lamination, document scanning, and online services simple, fast, and affordable. We emphasize accuracy, quality output, and timely delivery, ensuring that every customer gets dependable service without unnecessary delays. By combining essential stationery services with a streamlined digital system, we aim to offer convenience and consistency in one place.
                </p>
            </div>
        </section>
    )
}

export default About;
