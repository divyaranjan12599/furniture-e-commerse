import React from 'react';
import { CgHome, CgShoppingCart, CgPhone, CgInfo } from 'react-icons/cg';

function Footer() {
    return (
        <div>
            <div className="mt-4">
                <nav className="flex flex-row items-center justify-evenly bottom-nav align-center">
                    <a href="#" className="text-gray-400 hover:text-white flex items-center">
                        <CgHome className="mr-1" />
                        <span className='text-xs'>
                            Home
                        </span>
                    </a>
                    <a href="#" className="text-gray-400 hover:text-white flex items-center">
                        <CgShoppingCart className="mr-1" /> Shop
                    </a>
                    <a href="#" className="text-gray-400 hover:text-white flex items-center">
                        <CgPhone className="mr-1" /> Contact
                    </a>
                    <a href="#" className="text-gray-400 hover:text-white flex items-center">
                        <CgInfo className="mr-1" /> About Us
                    </a>
                </nav>
            </div>
        </div>
    );
}

export default Footer;
