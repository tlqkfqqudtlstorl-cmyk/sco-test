'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { hashPassword, verifyPassword } from '@/lib/auth/password';
import { getIronSessionTyped } from '@/lib/auth/session';
import { prisma } from '@/lib/db';
import { recalculateUserStats } from '@/lib/user-stats';

const USERNAME_RE = /^[a-zA-Z0-9_-]{3,24}$/;

function validateUrls(url: string | null): boolean {
  if (!url || url.trim() === '') return true;
  try {
    const u = new URL(url);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

export async function registerAction(
  _prev: { error?: string; ok?: boolean } | null,
  formData: FormData,
): Promise<{ error?: string; ok?: boolean } | null> {
  const username = String(formData.get('username') ?? '').trim();
  const email = String(formData.get('email') ?? '').trim().toLowerCase();
  const password = String(formData.get('password') ?? '');

  if (!USERNAME_RE.test(username)) {
    return { error: '아이디는 3–24자 영문·숫자·_- 만 사용할 수 있습니다.' };
  }
  if (!email.includes('@')) {
    return { error: '올바른 이메일을 입력하세요.' };
  }
  if (password.length < 8) {
    return { error: '비밀번호는 8자 이상이어야 합니다.' };
  }

  const exists = await prisma.user.findFirst({
    where: { OR: [{ email }, { username }] },
    select: { id: true },
  });
  if (exists) {
    return { error: '이미 사용 중인 이메일 또는 아이디입니다.' };
  }

  const user = await prisma.user.create({
    data: {
      username,
      email,
      password: await hashPassword(password),
    },
  });

  const session = await getIronSessionTyped();
  session.userId = user.id;
  await session.save();

  revalidatePath('/');
  return { ok: true };
}

export async function loginAction(
  _prev: { error?: string; ok?: boolean } | null,
  formData: FormData,
): Promise<{ error?: string; ok?: boolean; next?: string } | null> {
  const email = String(formData.get('email') ?? '').trim().toLowerCase();
  const password = String(formData.get('password') ?? '');
  const next = String(formData.get('next') ?? '').trim();

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || user.status !== 'ACTIVE') {
    return { error: '이메일 또는 비밀번호가 올바르지 않습니다.' };
  }

  const ok = await verifyPassword(password, user.password);
  if (!ok) {
    return { error: '이메일 또는 비밀번호가 올바르지 않습니다.' };
  }

  const session = await getIronSessionTyped();
  session.userId = user.id;
  await session.save();

  revalidatePath('/');
  const safeNext =
    next.startsWith('/') && !next.startsWith('//') ? next : '/';
  return { ok: true, next: safeNext };
}

export async function logoutAction(): Promise<void> {
  const session = await getIronSessionTyped();
  session.destroy();
  await session.save();
  revalidatePath('/');
  redirect('/');
}

export async function updateProfileAction(
  _prev: { error?: string; ok?: boolean } | null,
  formData: FormData,
): Promise<{ error?: string; ok?: boolean }> {
  const session = await getIronSessionTyped();
  if (!session.userId) {
    return { error: '로그인이 필요합니다.' };
  }

  const displayName = String(formData.get('displayName') ?? '').trim() || null;
  const bio = String(formData.get('bio') ?? '').trim() || null;
  const organization =
    String(formData.get('organization') ?? '').trim() || null;
  const githubUrl = String(formData.get('githubUrl') ?? '').trim() || null;
  const blogUrl = String(formData.get('blogUrl') ?? '').trim() || null;
  const avatarUrl = String(formData.get('avatarUrl') ?? '').trim() || null;

  if (bio && bio.length > 500) {
    return { error: '소개는 500자 이내입니다.' };
  }

  for (const [label, url] of [
    ['GitHub', githubUrl],
    ['블로그', blogUrl],
    ['아바타', avatarUrl],
  ] as const) {
    if (!validateUrls(url)) {
      return { error: `${label} URL 형식이 올바르지 않습니다.` };
    }
  }

  const updated = await prisma.user.update({
    where: { id: session.userId },
    data: {
      displayName,
      bio,
      organization,
      githubUrl,
      blogUrl,
      avatarUrl,
    },
    select: { username: true },
  });

  revalidatePath('/settings');
  revalidatePath(`/users/${updated.username}`);
  revalidatePath('/');

  return { ok: true };
}

export async function changePasswordAction(
  _prev: { error?: string; ok?: boolean } | null,
  formData: FormData,
): Promise<{ error?: string; ok?: boolean }> {
  const session = await getIronSessionTyped();
  if (!session.userId) {
    return { error: '로그인이 필요합니다.' };
  }

  const current = String(formData.get('currentPassword') ?? '');
  const next = String(formData.get('newPassword') ?? '');

  if (next.length < 8) {
    return { error: '새 비밀번호는 8자 이상이어야 합니다.' };
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { password: true },
  });
  if (!user) return { error: '사용자를 찾을 수 없습니다.' };

  const ok = await verifyPassword(current, user.password);
  if (!ok) return { error: '현재 비밀번호가 일치하지 않습니다.' };

  await prisma.user.update({
    where: { id: session.userId },
    data: { password: await hashPassword(next) },
  });

  return { ok: true };
}

/** 제출 기준으로 solved·rating 재계산 (설정 화면에서 호출) */
export async function syncStatsForCurrentUser(
  _formData?: FormData,
): Promise<void> {
  const session = await getIronSessionTyped();
  if (!session.userId) return;
  await recalculateUserStats(session.userId);
  revalidatePath('/settings');
  revalidatePath('/ranking');
}
