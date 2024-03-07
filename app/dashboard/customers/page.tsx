import dynamic from 'next/dynamic';
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