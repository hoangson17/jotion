import React from 'react'
import { Link } from 'react-router'
import { Button } from "@/components/ui/button"

const Home = () => {
  return (
    <div className="dark:bg-[#1F1F1F] h-full">
      <div className="pt-10">
        <div className="max-w-3xl space-y-4 text-black dark:text-white text-center mx-auto">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold">
            Your Ideas, Documents, & Plans. Unified. Welcome to{' '}
            <span className="underline">Jotion</span>
          </h1>
          <h3 className="text-base sm:text-xl md:text-2xl font-medium">
            Jotion is the connected workspace where <br />
            better, faster work happens
          </h3>
          <button className="flex items-center rounded-md bg-black text-white hover:bg-[#313131] dark:bg-white dark:text-black text-sm font-semibold h-10 px-4 py-2 m-auto dark:hover:bg-[#cdcdcd] cursor-pointer">
            Get Jotion Free
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4 ml-2"
            >
              <path d="M5 12h14"></path>
              <path d="m12 5 7 7-7 7"></path>
            </svg>
          </button>
        </div>
      </div>

      <div className="flex justify-center items-center flex-wrap gap-6 mt-6">
        <img
          className="w-[300px] h-[300px] sm:w-[350px] sm:h-[350px] md:h-[400px] md:w-[400px] hidden dark:block"
          src="https://28-jotion-clone.vercel.app/_next/image?url=%2Fdocuments-dark.png&w=1920&q=75"
          alt="Documents preview"
        />
        <img
          className="w-[300px] h-[300px] sm:w-[350px] sm:h-[350px] md:h-[400px] md:w-[400px] dark:hidden"
          src="https://jotion.osadhiv.com/_next/image?url=%2Fdocuments.png&w=1920&q=75"
          alt="Documents preview"
        />
        <img
          className="w-[300px] h-[300px] sm:w-[350px] sm:h-[350px] md:h-[400px] md:w-[400px] hidden dark:block"
          src="https://28-jotion-clone.vercel.app/_next/image?url=%2Freading-dark.png&w=1920&q=75"
          alt="Reading preview"
        />
        <img
          className="w-[300px] h-[300px] sm:w-[350px] sm:h-[350px] md:h-[400px] md:w-[400px] dark:hidden"
          src="https://jotion.osadhiv.com/_next/image?url=%2Freading.png&w=1920&q=75"
          alt="Reading preview"
        />
      </div>

      <div className='flex items-center w-full p-6 bg-background z-50 dark:bg-[#1F1F1F] justify-between'>
        <div className='flex items-center text-primary dark:text-white gap-x-2'>
            <Link to='/' className='flex items-center gap-x-2'>
                <img
                  className="hidden dark:block w-10"
                  src="https://jotion.osadhiv.com/logo-dark.svg"
                  alt="Jotion logo"
                />
                <img
                  className="dark:hidden w-10"
                  src="https://jotion.osadhiv.com/logo.svg"
                  alt="Jotion logo"
                />
                <p className='font-semibold'>Jotion</p>
            </Link>
        </div>
        <div className='flex items-center gap-x-2'>
            <Link to='/'><button className='px-2 py-1 rounded text-[#A3A3A3] hover:bg-[#d3d3d386] dark:hover:bg-[#5c5c5c86] cursor-pointer'>Privacy Policy</button></Link>
            <Link to='/'><button className='px-2 py-1 rounded text-[#A3A3A3] hover:bg-[#d3d3d386] dark:hover:bg-[#5c5c5c86] cursor-pointer'>Terms & Conditions</button></Link>
        </div>
      </div>
    </div>
  )
}

export default Home
