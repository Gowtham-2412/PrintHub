import React, { useContext, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { LogOut, Menu, UserCircle, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const Navbar = () => {
    const { user, logout, loading } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <div className='w-full shadow-md'>
            <div className='w-[90%] flex justify-between items-center mx-auto h-12 [&_a]:cursor-pointer'>
                <h1 className='text-2xl font-semibold cursor-pointer' onClick={() => navigate('/')}>Print<span>Hub</span></h1>
                
                <div className='hidden md:flex gap-5 items-center text-[#0f172a]'>
                    {!user ? (
                        <>
                            <a className='cursor-pointer hover:bg-[#c6c4c456] p-1.5 rounded-md' onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Home</a>
                            <a className='cursor-pointer hover:bg-[#c6c4c456] p-1.5 rounded-md' onClick={() => document.getElementById('services').scrollIntoView({ behavior: 'smooth' })}>Services</a>
                            <a className='cursor-pointer hover:bg-[#c6c4c456] p-1.5 rounded-md' onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}>Contact</a>
                        </>
                    ) : (
                        <>
                            <a className='cursor-pointer hover:bg-[#c6c4c456] p-1.5 rounded-md' onClick={() => navigate('/')}>Home</a>
                            <a className='cursor-pointer hover:bg-[#c6c4c456] p-1.5 rounded-md' onClick={() => navigate('/cart')}>Cart</a>
                            <a className='cursor-pointer hover:bg-[#c6c4c456] p-1.5 rounded-md' onClick={() => navigate('/my-orders')}>My Orders</a>
                        </>
                    )}
                </div>

                <div className='hidden md:flex gap-2.5 items-center justify-center text-sm text-[#0f172a]'>
                    {!user ? (
                        <>
                            <button disabled={loading} onClick={() => navigate('/register')} className='hover:underline'>Create Account→</button>
                            <button disabled={loading} onClick={() => navigate('/login')} className='bg-[#2563eb] px-2 py-1.5 rounded-lg text-[#fafafa] hover:bg-[#3458cd] active:bg-[#2a4dc1]'>Login</button>
                        </>
                    ) : (
                        <div className='flex justify-center items-center gap-3'>
                            <div className='hover:underline cursor-pointer flex justify-center gap-1 text-[#20469f]'>
                                <UserCircle className='w-6 h-6' />
                                {`Hello, ${user.name.split(' ')[0]}`}
                            </div>
                            <button disabled={loading} onClick={() => logout()}><LogOut className='w-6 h-6' /></button>
                        </div>
                    )}
                </div>

                <div className='md:hidden flex items-center'>
                    <button onClick={toggleMenu}>
                        {isMenuOpen ? <X className='w-6 h-6' /> : <Menu className='w-6 h-6' />}
                    </button>
                </div>
            </div>

            {isMenuOpen && (
                <div className='md:hidden bg-white w-full absolute left-0 shadow-md'>
                    <div className='flex flex-col items-center gap-5 text-[#0f172a] py-5'>
                        {!user ? (
                            <>
                                <a className='cursor-pointer hover:bg-[#c6c4c456] p-1.5 rounded-md' onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); toggleMenu(); }}>Home</a>
                                <a className='cursor-pointer hover:bg-[#c6c4c456] p-1.5 rounded-md' onClick={() => { document.getElementById('services').scrollIntoView({ behavior: 'smooth' }); toggleMenu(); }}>Services</a>
                                <a className='cursor-pointer hover:bg-[#c6c4c456] p-1.5 rounded-md' onClick={() => { document.getElementById('contact').scrollIntoView({ behavior: 'smooth' }); toggleMenu(); }}>Contact</a>
                                <div className='flex flex-col gap-2.5 items-center justify-center text-sm text-[#0f172a]'>
                                    <button disabled={loading} onClick={() => { navigate('/register'); toggleMenu(); }} className='hover:underline'>Create Account→</button>
                                    <button disabled={loading} onClick={() => { navigate('/login'); toggleMenu(); }} className='bg-[#2563eb] px-2 py-1.5 rounded-lg text-[#fafafa] hover:bg-[#3458cd] active:bg-[#2a4dc1]'>Login</button>
                                </div>
                            </>
                        ) : (
                            <>
                                <a className='cursor-pointer hover:bg-[#c6c4c456] p-1.5 rounded-md' onClick={() => { navigate('/'); toggleMenu(); }}>Home</a>
                                <a className='cursor-pointer hover:bg-[#c6c4c456] p-1.5 rounded-md' onClick={() => { navigate('/cart'); toggleMenu(); }}>Cart</a>
                                <a className='cursor-pointer hover:bg-[#c6c4c456] p-1.5 rounded-md' onClick={() => { navigate('/my-orders'); toggleMenu(); }}>My Orders</a>
                                <div className='flex justify-center items-center gap-3 mt-4'>
                                    <div className='hover:underline cursor-pointer flex justify-center gap-1 text-[#20469f]'>
                                        <UserCircle className='w-6 h-6' />
                                        {`Hello, ${user.name.split(' ')[0]}`}
                                    </div>
                                    <button disabled={loading} onClick={() => { logout(); toggleMenu(); }}><LogOut className='w-6 h-6' /></button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default Navbar;
