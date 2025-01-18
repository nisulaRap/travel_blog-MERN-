import React from 'react'

import LOGO from "../assets/images/travel-blog.png";

const Navbar = () => {
  return (
    <div className='bg-white flex items-center justify-between px-6 py-2 drop-shadow sticky top-0 z-10'>
        <img src={LOGO} alt="travel blog" className="h-24" />
    </div>
  )
}

export default Navbar