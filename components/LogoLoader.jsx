'use client';
import {useEffect,useState} from 'react';
import Image from 'next/image';
export default function LogoLoader(){
 const [show,setShow]=useState(true);
 useEffect(()=>{const t=setTimeout(()=>setShow(false),1300);return()=>clearTimeout(t)},[]);
 if(!show) return null;
 return <div className='fixed inset-0 z-[100] grid place-items-center bg-[#061113]'><div className='text-center'><Image src='/assets/nvg-logo.JPG' alt='NVG Cleaning Services loading logo' width={150} height={150} className='mx-auto animate-pulse rounded-[32px] shadow-glow'/><p className='mt-5 text-xl font-black text-white'>NVG Cleaning <span className='text-nvg'>Services</span></p></div></div>
}
