import React from 'react'

function Footer() {
    return (
        <div>
            <div className="md:hidden mt-4">
                <nav className="flex flex-col items-center space-y-4">
                    <a href="#" className="text-gray-400 hover:text-white">Home</a>
                    <a href="#" className="text-gray-400 hover:text-white">Shop</a>
                    <a href="#" className="text-gray-400 hover:text-white">Contact</a>
                    <a href="#" className="text-gray-400 hover:text-white">About Us</a>
                </nav>
            </div>
        </div>
    )
}

export default Footer;