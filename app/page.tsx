'use client';
import Image from "next/image";
import Appbar from "../app/components/Appbar";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Music2, Headphones, Users, Zap } from 'lucide-react'
import Link from "next/link"
import Redirect from "./components/Redirect";
import { useEffect } from "react";
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation';
/*

*/

export default function Home() {
  const session = useSession();
  const router = useRouter();
  useEffect(()=>{
    if(session?.data?.user){
        router.push('/dashboard');
    }
    else{
        router.push('/');
    }
  },[session])
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
      <Appbar/>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-purple-600 text-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Let Your Fans Choose the Music
                </h1>
                <p className="mx-auto max-w-[700px] text-purple-100 md:text-xl">
                  Engage your audience like never before. Stream music, let fans pick the tracks, and watch the magic happen on screen.
                </p>
              </div>
              <div className="space-x-4">
                <Button className="bg-white text-purple-600 hover:bg-purple-100" onClick={() => router.push('/dashboard')}>Get Started</Button>
                <Button variant="outline" className="text-black border-white hover:bg-purple-700">Learn More</Button>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12 text-gray-800 dark:text-white">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg transition-transform hover:scale-105">
                <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center mb-4">
                  <Headphones className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">Create Your Stream</h3>
                <p className="text-gray-600 dark:text-gray-300">Set up your music stream in minutes with our easy-to-use platform</p>
              </div>
              <div className="flex flex-col items-center text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg transition-transform hover:scale-105">
                <div className="w-16 h-16 bg-pink-500 text-white rounded-full flex items-center justify-center mb-4">
                  <Users className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">Fans Choose Songs</h3>
                <p className="text-gray-600 dark:text-gray-300">Your audience picks the tracks they want to hear, boosting engagement</p>
              </div>
              <div className="flex flex-col items-center text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg transition-transform hover:scale-105">
                <div className="w-16 h-16 bg-yellow-500 text-white rounded-full flex items-center justify-center mb-4">
                  <Zap className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">Music Plays On Screen</h3>
                <p className="text-gray-600 dark:text-gray-300">Watch as the chosen songs play in real-time, creating a unique experience</p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-pink-500 to-purple-600 text-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Ready to Transform Your Streams?</h2>
                <p className="max-w-[600px] text-purple-100 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Join thousands of creators who are revolutionizing their music streams. Sign up now and start engaging your audience like never before.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <form className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                  <Input placeholder="Enter your email" type="email" className="bg-white text-gray-800" />
                  <Button type="submit" className="bg-yellow-500 text-gray-800 hover:bg-yellow-400">Sign Up</Button>
                </form>
                <p className="text-xs text-purple-100">
                  By signing up, you agree to our Terms & Conditions and Privacy Policy.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full py-6 bg-white dark:bg-gray-800 shadow-md mt-12">
        
      </footer>
    </div>
    
  );
}
