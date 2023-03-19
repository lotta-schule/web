import { headers } from 'next/headers';

export const getBaseUrl = () => {
    const headersList = headers();
    const host = headersList.get('host');
    const isHttps = headersList.get('X-Forwarded-Proto') === 'https';
    const protocol = isHttps ? 'https' : 'http';
    return (
        process.env.NEXT_PUBLIC_BASE_URL ||
        `${protocol}://${host ?? 'localhost'}`
    );
};
