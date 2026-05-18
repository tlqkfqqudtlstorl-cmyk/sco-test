import { getIronSession, type IronSession, type SessionOptions } from 'iron-session';
import { cookies } from 'next/headers';

export type SessionData = {
  userId?: string;
};

function sessionPassword(): string {
  const s = process.env.SESSION_SECRET;
  if (s && s.length >= 32) return s;
  if (process.env.NODE_ENV === 'production') {
    console.warn(
      '[banye] SESSION_SECRET 미설정 또는 32자 미만 — 운영 배포 전 반드시 설정하세요.',
    );
  }
  return '01234567890123456789012345678901';
}

export const sessionOptions: SessionOptions = {
  cookieName: 'banye_session',
  password: sessionPassword(),
  ttl: 60 * 60 * 24 * 14,
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  },
};

export async function getIronSessionTyped(): Promise<
  IronSession<SessionData>
> {
  const cookieStore = await cookies();
  return getIronSession<SessionData>(cookieStore, sessionOptions);
}
