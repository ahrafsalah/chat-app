"use client"
import {  useAuth } from '@/hooks/useAuth'
import {  LogOut, MessageSquare, Settings, User, UserRound } from 'lucide-react'
import Link from 'next/link'


const NavBar = () => {
  const {isLoggedIn, logout} = useAuth()


  return (
    <header className='className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 
    backdrop-blur-lg bg-base-100/80'>
      <nav className='container flex items-center justify-between p-4'>
         <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-all">
              <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-lg font-bold">Chatty</h1>
            </Link>
        
          <div className="flex items-center gap-2">
            <Link
              href={"/settings"}
              className={`
              btn btn-sm gap-2 transition-colors
              
              `}
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </Link>

            {isLoggedIn && (
              <>
                <Link href={"/profile"} className={`btn btn-sm gap-2`}>
                  <User className="size-5" />
                  <span className="hidden sm:inline">Profile</span>
                </Link>

                <button className="flex gap-2 items-center cursor-pointer" onClick={() => logout()}>
                  <LogOut className="size-5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            )}
          </div>
      </nav>
    </header>
  )
}

export default NavBar