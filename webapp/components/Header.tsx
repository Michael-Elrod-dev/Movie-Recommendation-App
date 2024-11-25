// components/Header.tsx
'use client'

import { useState } from 'react'
import { FiSearch } from 'react-icons/fi'
import Link from 'next/link'

export default function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  return (
    <header className="fixed w-full z-50 bg-black/95">
      <nav className="flex items-center justify-between p-4 max-w-7xl mx-auto">
        <div className="flex items-center space-x-8">
          <h1 className="text-2xl font-bold text-red-600">MOVIEFLIX</h1>
          <div className="flex space-x-6">
            <Link href="/browse" className="hover:text-gray-300">Browse</Link>
            <Link href="/mylist" className="hover:text-gray-300">My List</Link>
          </div>
        </div>
        
        <div className="flex items-center relative">
          <input
            className={`
              bg-white text-black rounded-full py-2 px-4 pr-12 outline-none absolute right-0
              transition-all duration-300 ease-in-out
              ${isSearchOpen ? 'w-60 opacity-100' : 'w-0 opacity-0'}
            `}
            placeholder="Search titles..."
            autoFocus={isSearchOpen}
          />
          <button 
            className={`p-2 hover:bg-gray-800 rounded-full z-10 transition-colors
              ${isSearchOpen ? 'bg-gray-800' : ''}`}
            onClick={() => setIsSearchOpen(!isSearchOpen)}
          >
            <FiSearch className="w-6 h-6" />
          </button>
        </div>
      </nav>
    </header>
  )
}