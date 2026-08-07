'use client';
import {useState} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {Menu, X, ChevronRight, Facebook, Instagram} from 'lucide-react';

const nav=[['Home','/'],['About Us','/about'],['Services','/services'],['Pricing','/pricing'],['Cleaning Results','/gallery'],['Testimonials','/#testimonials'],['Blog','/blog'],['Contact Us','/contact']];

export default function Header(){
 const [open,setOpen]=useState(false);
 return <>
  <header className='fixed top-0 left-0 right-0 z-50 border-b border-cyan-400/20 bg-[#061113]/90 backdrop-blur-xl'>
   <div className='mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-8'>
    <Link href='/' className='flex items-center gap-3'>
     <Image src='/assets/nvg-logo.JPG' alt='NVG Cleaning Services logo' width={58} height={58} className='h-14 w-14 rounded-2xl object-cover shadow-glow'/>
     <div className='leading-tight'><p className='text-xl font-black text-white'>NVG Cleaning</p><p className='text-lg font-black tracking-wide text-nvg'>Services</p></div>
    </Link>
    <div className='flex items-center gap-3'>
     <Link href='/contact' className='hidden rounded-full bg-gradient-to-r from-nvg to-blue px-6 py-3 font-black text-white shadow-glow sm:inline-flex'>Get Free Quote</Link>
     <button onClick={()=>setOpen(true)} aria-label='Open menu' className='rounded-2xl border border-cyan-400/20 bg-cyan-950/60 p-3 text-white'><Menu size={30}/></button>
    </div>
   </div>
  </header>
  <div className={`fixed inset-0 z-[70] transition ${open?'pointer-events-auto':'pointer-events-none'}`}>
   <div onClick={()=>setOpen(false)} className={`absolute inset-0 bg-black/65 transition-opacity ${open?'opacity-100':'opacity-0'}`}/>
   <aside className={`absolute left-0 top-0 h-full w-[82%] max-w-[360px] border-r-4 border-cyan-500 bg-white px-8 py-8 shadow-2xl transition-transform duration-500 ${open?'translate-x-0':'-translate-x-full'}`}>
    <button onClick={()=>setOpen(false)} aria-label='Close menu' className='absolute -right-7 top-12 rounded-full bg-cyan-600 p-3 text-white shadow-xl'><X/></button>
    <Image src='/assets/nvg-logo.jpeg' alt='NVG Cleaning Services logo' width={150} height={150} className='mx-auto mb-10 rounded-3xl object-cover'/>
    <nav className='space-y-1'>{nav.map(([n,h])=><Link onClick={()=>setOpen(false)} key={n} href={h} className='flex items-center justify-between border-b border-slate-200 py-4 text-lg font-semibold text-slate-900 hover:text-cyan-600'><span>{n}</span><ChevronRight size={20}/></Link>)}</nav>
    <div className='mt-12 flex justify-center gap-8 text-cyan-600'><a aria-label='Facebook' href='https://www.facebook.com/share/17jNNdiyoM/?mibextid=wwXIfr'><Facebook size={28}/></a><a aria-label='Instagram' href='https://www.instagram.com/nvgcleaningservices?igsh=bGttMnRnbjl0ZnFz&utm_source=qr'><Instagram size={28}/></a></div>
   </aside>
  </div>
 </>
}
