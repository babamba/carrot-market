import type { NextRequest, NextFetchEvent } from 'next/server';
import { NextResponse } from 'next/server';

export default function middleware(req: NextRequest, ev: NextFetchEvent) {
    if (req.ua?.isBot) {
        return new Response("Plz don't be a bot. Be Human", {
            status: 403,
        });
    }

    if (
        !req.url.includes('/api') &&
        !req.url.includes('/confirm') &&
        !req.url.includes('/enter') &&
        !req.cookies.carrotsession
    ) {
        return NextResponse.redirect(`${req.nextUrl.origin}/enter`);
    }

    //return NextResponse.json({ ok: true });
}
