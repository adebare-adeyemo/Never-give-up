import Image from 'next/image';
const items=[
 ['bedroom-deep-cleaning-leeds-before-after.webp','Bedroom Deep Clean','Leeds'],
 ['toaster-cleaning-before-after.webp','Appliance Detail Clean','Leeds'],
 ['radiator-cleaning-before-after.webp','Radiator Cleaning','Yorkshire'],
 ['end-of-tenancy-room-cleaning-before-after.webp','End of Tenancy Room Clean','Leeds'],
 ['oven-cleaning-leeds-before-after.webp','Oven Deep Cleaning','Leeds'],
 ['sink-cupboard-cleaning-before-after.webp','Sink Cupboard Cleaning','Yorkshire']
];
export default function GalleryGrid(){return <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>{items.map(([img,title,loc])=><article key={img} className='group overflow-hidden rounded-[28px] border border-cyan-400/20 bg-slate-950 shadow-card'><div className='relative h-72 overflow-hidden'><Image src={`/assets/${img}`} alt={`${title} before and after by NVG Cleaning Services`} fill className='object-cover transition duration-700 group-hover:scale-105'/><span className='absolute left-4 top-4 rounded-full bg-black/65 px-4 py-2 text-sm font-black text-white'>Before</span><span className='absolute right-4 top-4 rounded-full bg-nvg px-4 py-2 text-sm font-black text-white'>After</span><span className='absolute left-1/2 top-1/2 grid h-10 w-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-black/70 text-white'>↔</span></div><div className='p-5'><h3 className='text-xl font-black text-white'>{title}</h3><p className='text-cyan-100/70'>{loc}</p></div></article>)}</div>}
