import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 py-6 mt-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-blue-700 to-blue-400 text-transparent bg-clip-text">
              World Explorer
            </h3>
            <p className="text-gray-500 text-sm">Explore countries around the world</p>
          </div>
        </div>
        <div className="mt-4 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} World Explorer. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;