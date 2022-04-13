import { withIronSessionApiRoute, withIronSessionSsr } from 'iron-session/next';
import { IronSessionOptions } from 'iron-session';

declare module 'iron-session' {
    interface IronSessionData {
        user?: {
            id: number;
        };
    }
}
const thirdtyMinutesInSeconds = 60 * 30;

const IRON_OPTIONS: IronSessionOptions = {
    cookieName: 'carrotsession',
    password: process.env.COOKIE_PASSWORD!,
    ttl: thirdtyMinutesInSeconds,
};

export function withApiSession(fn: any) {
    return withIronSessionApiRoute(fn, IRON_OPTIONS);
}

export function withSsrSession(handler: any) {
    return withIronSessionSsr(handler, IRON_OPTIONS);
}
