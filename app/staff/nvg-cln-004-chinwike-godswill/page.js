import CleanerProfile from '@/components/CleanerProfile';
import { CLEANERS, cleanerMetadata } from '@/lib/staff';

const SLUG = 'nvg-cln-004-chinwike-godswill';

export const dynamic = 'force-static';
export const metadata = cleanerMetadata(SLUG);

export default function Page() {
  return <CleanerProfile cleaner={CLEANERS[SLUG]} />;
}
