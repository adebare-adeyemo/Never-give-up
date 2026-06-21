import Image from 'next/image';
import Link from 'next/link';
import Reveal from '@/components/Reveal';
import GalleryGrid from '@/components/GalleryGrid';
import {Home as HomeIcon, Sparkles, Building2, CalendarCheck, ShieldCheck, Clock, ThumbsUp, Star, Phone, ArrowRight, ClipboardCheck} from 'lucide-react';

const services=[
 {title:'Domestic Cleaning',icon:HomeIcon,img:'nvg-team-cleaning-kitchen.webp',text:'Regular home cleaning tailored to your routine and the rooms you want cleaned.'},
 {title:'Deep Cleaning',icon:Sparkles,img:'toaster-cleaning-before-after.webp',text:'Detailed cleaning for kitchens, bathrooms, appliances, floors and neglected corners.'},
 {title:'Airbnb Cleaning',icon:CalendarCheck,img:'bedroom-deep-cleaning-leeds-before-after.webp',text:'Guest-ready turnover cleaning with linen, towels, staging and restocking options.'},
 {title:'End of Tenancy Cleaning',icon:ClipboardCheck,img:'end-of-tenancy-room-cleaning-before-after.webp',text:'Move-out cleaning for tenants, landlords and letting agents across Yorkshire.'},
 {title:'Commercial Cleaning',icon:Building2,img:'oven-cleaning-leeds-before-after.webp',text:'Office, restaurant and business cleaning packages tailored to your needs.'}
];
const pricingPreview=[
 ['Regular Domestic Cleaning','£20/hour','Minimum booking: 2 hours'],
 ['Deep Cleaning','From £120','Studio/1 bed starting price'],
 ['Airbnb Cleaning','From £55','Guest-ready turnover cleaning'],
 ['Pressure Washing','From £60','Decking, patio and driveway options']
];

const reviews=[
 ['Akinro Olubunmi','I recently used this cleaning company and I was very impressed with their service. The team was professional, punctual, and paid attention to every detail. They did an excellent job cleaning my space, leaving everything spotless and fresh.'],
 ['Billie Morris','I had a great experience with Never Give Up Cleaning Services Ltd. Bami is easy to communicate with, arrived on time, and did an amazing job cleaning my home. Bami is respectful, efficient, and paid attention to small details.'],
 ['Itohan Odekunle','An excellent cleaning service. Bami always delivers exceptional results and is extremely personable!'],
 ['Raj Bharath','Bami is an excellent cleaner with very high standards, very polite and always does a great job. I would recommend him to anyone.'],
 ['Georgina Mattsson','Amazing service !! Would highly recommend. ❤️🔥'],
 ['John Amoako','Great you guys did for us.'],
 ['Jennifer Williams',"I’ve been with NGU Cleaning for some time now. What a joy my cleaner is. Polite, professional and does an excellent job. Highly recommend and a greatly appreciated service."],
 ['Kathryn','Bamidele was so courteous, professional and thorough. He did such a great job deep cleaning our new home and work space.']
];

export default function Home(){
 const schema={"@context":"https://schema.org","@type":"CleaningService",name:'NVG Cleaning Services LTD',image:'https://nvgcleaningservices.co.uk/assets/nvg-logo.jpeg',telephone:'0333 034 7101',email:'booking@nvgcleaningservices.co.uk',address:{'@type':'PostalAddress',streetAddress:'36 Dawlish Mount',postalCode:'LS9 9DZ',addressCountry:'GB'},areaServed:['Leeds','York','Bradford','Wakefield','Harrogate','Yorkshire'],url:'https://nvgcleaningservices.co.uk',sameAs:['https://www.instagram.com/nvgcleaningservices','https://www.facebook.com/share/17jNNdiyoM/']};
 return <><script type='application/ld+json' dangerouslySetInnerHTML={{__html:JSON.stringify(schema)}}/>
 <section className='hero-bg relative min-h-screen overflow-hidden pt-24'>
  <div className='absolute inset-0 opacity-100'><Image src='/assets/nvg-team-cleaning-kitchen.webp' alt='NVG Cleaning team professionally cleaning a kitchen' fill priority className='object-cover object-center'/></div>
  <div className='absolute inset-0 bg-gradient-to-r from-[#061113]/82 via-[#061113]/38 to-[#061113]/72'/>
  <div className='container relative z-10 grid min-h-[calc(100vh-96px)] items-center py-12 lg:grid-cols-2'>
   <Reveal className='max-w-2xl'>
    <span className='inline-flex rounded-full bg-nvg/20 px-4 py-2 text-sm font-black text-nvg shadow-glow'>Reliable • Professional • Detail-focused</span>
    <h1 className='mt-6 text-5xl font-black leading-[1.02] text-white sm:text-6xl lg:text-7xl'>Professional <span className='text-nvg'>Cleaning</span> Services You Can Trust</h1>
    <p className='mt-6 max-w-xl text-lg font-medium leading-8 text-white/80'>We help homes, landlords, Airbnb hosts and businesses keep their spaces fresh, clean and guest-ready.</p>
    <div className='mt-8 flex flex-wrap gap-4'><Link href='/contact' className='btn btn-primary'>Book Now</Link><a href='https://wa.me/443330347101' className='btn btn-outline'>WhatsApp Us</a></div>
    <div className='mt-8 flex flex-wrap gap-5 text-sm font-bold text-white/85'><span>✓ Reliable</span><span>✓ Trained Cleaners</span><span>✓ Satisfaction Guaranteed</span></div>
   </Reveal>
  </div>
 </section>

 <section className='-mt-20 relative z-20 px-4'><div className='mx-auto grid max-w-5xl grid-cols-2 gap-3 rounded-[28px] border border-cyan-400/20 bg-[#061113]/90 p-5 shadow-glow backdrop-blur md:grid-cols-4'>
  {[['100+','Happy Clients',Star],['200+','Jobs Completed',HomeIcon],['5★','Google Rating',ShieldCheck],['24/7','Support',Clock]].map(([n,t,Icon])=><div key={t} className='border-cyan-400/20 py-4 text-center md:border-r last:border-r-0'><Icon className='mx-auto mb-2 text-nvg'/><p className='text-3xl font-black text-white'>{n}</p><p className='text-sm font-semibold text-white/70'>{t}</p></div>)}
 </div></section>

 <section className='section blue-section'><div className='container'>
  <Reveal className='text-center'><span className='rounded-full bg-nvg/15 px-4 py-2 text-sm font-black text-nvg'>Our Services</span><h2 className='mt-5 text-4xl font-black text-white'>Cleaning Services <span className='text-nvg'>We Offer</span></h2></Reveal>
  <div className='mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3'>{services.map(({title,icon:Icon,img,text})=><Reveal key={title} className='group relative min-h-[210px] overflow-hidden rounded-[28px] border border-cyan-400/20 bg-slate-950 p-6 shadow-card'><Image src={`/assets/${img}`} alt={title} fill className='object-cover opacity-35 transition duration-700 group-hover:scale-105'/><div className='absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent'/><div className='relative z-10 flex h-full flex-col justify-end'><div className='mb-4 grid h-14 w-14 place-items-center rounded-full bg-cyan-500/20 text-nvg shadow-glow'><Icon size={30}/></div><h3 className='text-2xl font-black text-white'>{title}</h3><p className='mt-2 text-sm leading-6 text-white/75'>{text}</p><ArrowRight className='mt-4 text-nvg'/></div></Reveal>)}</div>
 </div></section>

 <section className='section green-section'><div className='container'>
  <div className='mb-10 flex flex-wrap items-end justify-between gap-6'><Reveal><span className='text-sm font-black uppercase text-nvg'>Pricing</span><h2 className='mt-2 text-4xl font-black text-white'>Clear Starting Prices</h2><p className='mt-3 max-w-2xl text-white/70'>Prices may vary depending on property condition, size, accessibility and specific cleaning requirements.</p></Reveal><Link href='/pricing' className='btn btn-outline'>View Full Pricing <ArrowRight className='ml-2'/></Link></div>
  <div className='grid gap-5 md:grid-cols-2 lg:grid-cols-4'>{pricingPreview.map(([name,price,note])=><Reveal key={name} className='rounded-[28px] border border-cyan-400/20 bg-white/5 p-6 shadow-card'><h3 className='text-xl font-black text-white'>{name}</h3><p className='mt-4 text-2xl font-black text-nvg'>{price}</p><p className='mt-3 text-sm leading-6 text-white/65'>{note}</p></Reveal>)}</div>
 </div></section>

 <section className='section green-section'><div className='container'>
  <Reveal className='text-center'><h2 className='text-4xl font-black text-white'>Why Choose <span className='text-nvg'>NVG Cleaning?</span></h2></Reveal>
  <div className='mt-10 grid gap-5 rounded-[32px] border border-cyan-400/20 bg-white/5 p-5 md:grid-cols-4'>{[[ShieldCheck,'Trusted & Reliable','We turn up on time and get the job done.'],[Sparkles,'Attention to Detail','We clean every corner to a high standard.'],[Phone,'Flexible & Affordable','Services tailored to your needs and budget.'],[ThumbsUp,'Satisfaction Guaranteed','Happy customers are our priority.']].map(([Icon,title,text])=><Reveal key={title} className='p-5 text-center'><Icon className='mx-auto mb-4 text-nvg' size={40}/><h3 className='font-black text-white'>{title}</h3><p className='mt-2 text-sm text-white/70'>{text}</p></Reveal>)}</div>
 </div></section>

 <section className='section blue-section'><div className='container'>
  <div className='mb-10 flex flex-wrap items-end justify-between gap-6'><Reveal><span className='text-sm font-black uppercase text-nvg'>Our Work</span><h2 className='mt-2 text-4xl font-black text-white'>Cleaning Results<br/>That Speak for Themselves</h2></Reveal><Link href='/gallery' className='btn btn-outline'>View More Results <ArrowRight className='ml-2'/></Link></div>
  <GalleryGrid/>
 </div></section>

 <section id='testimonials' className='section green-section'><div className='container'>
  <Reveal className='mb-10 flex flex-wrap items-end justify-between gap-6'><div><span className='text-sm font-black uppercase text-nvg'>Testimonials</span><h2 className='mt-2 text-4xl font-black text-white'>What Our <span className='text-nvg'>Clients Say</span></h2></div><div className='rounded-3xl border border-cyan-400/20 bg-white/5 p-5'><p className='text-lg font-black text-white'>Google Reviews <span className='text-gold'>5.0 ★★★★★</span></p><p className='text-sm text-white/60'>Based on recent Google customer feedback.</p></div></Reveal>
  <div className='grid gap-5 md:grid-cols-2 lg:grid-cols-3'>{reviews.map(([name,text])=><Reveal key={name} className='card p-7'><div className='flex items-center justify-between gap-4'><p className='text-2xl text-gold'>★★★★★</p><span className='rounded-full bg-white/10 px-3 py-1 text-xs font-black text-white/70'>Google</span></div><p className='mt-5 leading-7 text-white/82'>“{text}”</p><div className='mt-6 flex items-center gap-3'><div className='grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-nvg to-blue font-black text-white'>{name[0]}</div><div><p className='font-black text-white'>{name}</p><p className='text-xs text-white/55'>Google Review</p></div></div></Reveal>)}</div>
 </div></section>

 <section className='section hero-bg'><div className='container'><div className='glass flex flex-col items-center justify-between gap-6 rounded-[32px] p-8 text-center md:flex-row md:text-left'><Image src='/assets/nvg-logo.jpeg' alt='NVG Cleaning Services logo' width={90} height={90} className='rounded-3xl'/><div className='flex-1'><h2 className='text-3xl font-black text-white'>Ready for a Spotless Space?</h2><p className='mt-2 text-white/70'>Get a free, no-obligation quote today.</p></div><Link href='/contact' className='btn btn-primary'>Get Free Quote <ArrowRight className='ml-2'/></Link></div></div></section>
 </>}
