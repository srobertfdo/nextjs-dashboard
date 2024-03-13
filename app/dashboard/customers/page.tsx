import dynamic from 'next/dynamic';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Customers',
};

const DynamicClientComponent = dynamic(() => import('@/app/ui/customers/table'), {
    ssr: true,
});

export default function Page() {
    
    return (
        <div>
            <DynamicClientComponent/>
        </div>
    );
}