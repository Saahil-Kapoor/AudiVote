"use client"

import { Button } from "@/components/ui/button"
import { Music2} from 'lucide-react'

import { signIn, signOut, useSession } from 'next-auth/react'

import Link from 'next/link';
import React from 'react'

export default function Appbar() {
  const session = useSession();
    return (
    <div className="px-4 lg:px-6 h-16 flex items-center bg-white dark:bg-gray-800 shadow-sm">
        <Link className="flex items-center justify-center" href="#">
          <Music2 className="h-6 w-6 text-purple-600 dark:text-purple-400" />
          <span className="ml-2 text-xl font-bold text-gray-800 dark:text-white">AudiVote</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm pt-2  font-medium hover:text-purple-600 dark:hover:text-purple-400 transition-colors" href="#">
            About
          </Link>
          <Link className="text-sm font-medium hover:text-purple-600 dark:hover:text-purple-400 transition-colors" href="#">
          {session.data?.user?<Button className='bg-purple-600' onClick={()=>signOut()}>Logout</Button>:""}
          {!session.data?.user?<Button className='bg-purple-600' onClick={()=>signIn()}>Sign In</Button>:""}
          </Link>
        </nav>
    </div>
  )
}
