import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LogoLoader from '@/components/LogoLoader';
import {GoogleAnalytics} from '@next/third-parties/google';
import { Poppins } from 'next/font/google';

const poppins=Poppins({subsets:['latin'],weight:['400','500','600','700','800','900'],display:'swap'});
export const metadata={metadataBase:new URL('https://nvgcleaningservices.co.uk'),title:{default:'NVG Cleaning Services | Professional Cleaning Services in Leeds',template:'%s | NVG Cleaning Services'},description:'Professional domestic, deep, Airbnb, end of tenancy, commercial and pressure washing cleaning services across Leeds, Bradford, York, Wakefield, Harrogate and Yorkshire.',openGraph:{title:'NVG Cleaning Services',description:'Professional Cleaning Services You Can Trust',url:'https://nvgcleaningservices.co.uk',siteName:'NVG Cleaning Services',images:['/assets/nvg-team-cleaning-kitchen.webp'],locale:'en_GB',type:'website'}};
export default function RootLayout({children}){return <html lang='en-GB'><body className={poppins.className}><LogoLoader/><Header/>{children}<Footer/><GoogleAnalytics gaId='G-XXXXXXXXXX'/></body></html>}
