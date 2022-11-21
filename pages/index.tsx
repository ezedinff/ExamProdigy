import Head from 'next/head'
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Suspense, useEffect, useState } from 'react';


const HomePage = ({session}: any) => {
  const router = useRouter();

  useEffect(() => {
    if (session) {
      console.log(session);
      router.push('/exams');
    }
  }, [router, session]);

  
  return (
    <Suspense fallback={<div>Loading...</div>}>
          <div className="flex flex-col min-h-screen h-full w-full overflow-hidden">
      <Head>
        <title>Home | Exam Prep</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex flex-col justify-center w-full flex-1 h-full">
          <div className="flex flex-col justify-center w-full md:px-20 overflow-hidden scroll-hidden h-full relative" style={{padding: "0 16px", top: "-5rem"}}>
            <h1 className="text-4xl font-bold sm:text-8xl  md:px-32 xs:text-2xl text-teal-500 px:10 ">
              Exam Prep
            </h1>
            <p className="mt-3 text-2xl break-words md:px-32 md:w-2/3 sm:text-3xl xs:w-full text-gray-400">
              Practice for your exams with our free questions and explanations. The questions are curated from the best sources and are updated regularly.
            </p>
            <div className="flex justify-start xs:w-full z-10 md:px-32">
             <Link href="/sign-in">
              <button className="mt-4 px-4 py-2 text-sm bg-teal-500 text-white rounded-md hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-opacity-50">
                Get Started
              </button>
            </Link>
            </div>
          </div>
          <div className='absolute bottom-0 w-full'>
            <svg className="w-full" viewBox="0 0 1440 320">
              <path fill="#006c6c" fillOpacity="1" d="M0,224L48,202.7C96,181,192,139,288,133.3C384,128,480,160,576,170.7C672,181,768,171,864,170.7C960,171,1056,181,1152,170.7C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
            </svg>
          </div>
        </div>
    </div>
    </Suspense>
  );
};


export default HomePage;

