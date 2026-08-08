import CleanerProfile from '@/components/CleanerProfile';
import { CLEANERS, cleanerMetadata } from '@/lib/staff';

const SLUG = 'nvg-cln-002-esosa-tamara-bello';

export const dynamic = 'force-static';
export const metadata = cleanerMetadata(SLUG);

export default function Page() {
  return <CleanerProfile cleaner={CLEANERS[SLUG]} />;
}
