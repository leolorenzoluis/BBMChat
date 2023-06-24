
// export const runtime = 'edge'


import { rateLimiter } from '@/app/redis';
import { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
    const ip = req.headers.get("x-forwarded-for")

    const isRateLimited = await rateLimiter(ip!);

    if (isRateLimited) {
        return new Response('Too many requests', { status: 429 });
    }
    return new Response('Hello world');

}