'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { Camera, ExternalLink, BookOpen, Mail, Shield } from 'lucide-react';

import {
  changePasswordAction,
  syncStatsForCurrentUser,
  updateProfileAction,
  uploadAvatarAction,
} from '@/app/actions/auth';

type ProfileInitial = {
  displayName: string;
  bio: string;
  organization: string;
  githubUrl: string;
  blogUrl: string;
  avatarUrl: string;
};

type Props = {
  email: string;
  initial: ProfileInitial;
};

export default function SettingsForms({ email, initial }: Props) {
  const [avatarPreview, setAvatarPreview] = useState(initial.avatarUrl || '');
  const [avatarMsg, setAvatarMsg] = useState<{ error?: string }>({});
  const [pendingAvatar, setPendingAvatar] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const [profileMsg, setProfileMsg] = useState<{ ok?: boolean; error?: string }>(
    {},
  );
  const [pwMsg, setPwMsg] = useState<{ ok?: boolean; error?: string }>({});
  const [pendingProfile, setPendingProfile] = useState(false);
  const [pendingPw, setPendingPw] = useState(false);

  async function onAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarMsg({});
    setPendingAvatar(true);

    const fd = new FormData();
    fd.append('avatar', file);
    const res = await uploadAvatarAction(fd);
    setPendingAvatar(false);

    if (res?.error) {
      setAvatarMsg({ error: res.error });
    } else if (res?.url) {
      setAvatarPreview(res.url);
    }
  }

  async function onProfileSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setProfileMsg({});
    setPendingProfile(true);
    const fd = new FormData(e.currentTarget);
    const res = await updateProfileAction(null, fd);
    setPendingProfile(false);
    if (res?.error) setProfileMsg({ error: res.error });
    else setProfileMsg({ ok: true });
  }

  async function onPwSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPwMsg({});
    setPendingPw(true);
    const fd = new FormData(e.currentTarget);
    const res = await changePasswordAction(null, fd);
    setPendingPw(false);
    if (res?.error) setPwMsg({ error: res.error });
    else {
      setPwMsg({ ok: true });
      e.currentTarget.reset();
    }
  }

  return (
    <div className="space-y-6">
      <section className="box">
        <div className="box-header">
          <h2 className="text-base font-semibold text-[var(--text-primary)]">
            프로필 사진
          </h2>
        </div>
        <div className="box-body">
          <div className="flex items-center gap-6">
            <div className="relative group">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-[var(--bg-tertiary)] border-2 border-[var(--border-primary)]">
                {avatarPreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={avatarPreview} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-[var(--text-muted)]">
                    {(initial.displayName || email)[0]?.toUpperCase() || '?'}
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={pendingAvatar}
                className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                <Camera size={18} className="text-white" />
              </button>
            </div>
            <div>
              <input
                ref={fileRef}
                type="file"
                accept="image/png,image/jpeg,image/gif,image/webp"
                onChange={onAvatarUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={pendingAvatar}
                className="btn btn-secondary rounded-md px-4 py-1.5 text-sm"
              >
                {pendingAvatar ? '업로드 중…' : '사진 변경'}
              </button>
              <p className="text-xs text-[var(--text-muted)] mt-1.5">PNG, JPG, GIF, WebP · 2MB 이하</p>
              {avatarMsg.error && <p className="text-xs text-[var(--accent-red)] mt-1">{avatarMsg.error}</p>}
            </div>
          </div>
        </div>
      </section>

      <section className="box">
        <div className="box-header">
          <h2 className="text-base font-semibold text-[var(--text-primary)]">
            로그인 정보
          </h2>
        </div>
        <div className="box-body space-y-2">
          <p className="text-xs text-[var(--text-muted)]">이메일</p>
          <p className="font-mono text-sm text-[var(--text-primary)]">{email}</p>
        </div>
      </section>

      <section className="box">
        <div className="box-header">
          <h2 className="text-base font-semibold text-[var(--text-primary)]">
            공개 프로필
          </h2>
        </div>
        <div className="box-body">
          <form onSubmit={onProfileSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-[var(--text-muted)] mb-1.5">
                표시 이름
              </label>
              <input
                name="displayName"
                defaultValue={initial.displayName}
                className="input w-full"
                placeholder="비워두면 아이디로 표시"
              />
            </div>
            <div>
              <label className="block text-xs text-[var(--text-muted)] mb-1.5">
                소개
              </label>
              <textarea
                name="bio"
                defaultValue={initial.bio}
                rows={4}
                className="input w-full resize-y min-h-[100px]"
                placeholder="한 줄 소개"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-[var(--text-muted)] mb-1.5">
                  소속
                </label>
                <input
                  name="organization"
                  defaultValue={initial.organization}
                  className="input w-full"
                />
              </div>
              <div>
                <label className="block text-xs text-[var(--text-muted)] mb-1.5">
                  GitHub URL
                </label>
                <input
                  name="githubUrl"
                  type="url"
                  defaultValue={initial.githubUrl}
                  className="input w-full"
                  placeholder="https://github.com/..."
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-[var(--text-muted)] mb-1.5">
                  블로그 URL
                </label>
                <input
                  name="blogUrl"
                  type="url"
                  defaultValue={initial.blogUrl}
                  className="input w-full"
                />
              </div>
              <div>
                <label className="block text-xs text-[var(--text-muted)] mb-1.5">
                  아바타 이미지 URL
                </label>
                <input
                  name="avatarUrl"
                  type="url"
                  defaultValue={initial.avatarUrl}
                  className="input w-full"
                  placeholder="https://..."
                />
              </div>
            </div>
            {profileMsg.error ? (
              <p className="text-sm text-[var(--accent-red)]">{profileMsg.error}</p>
            ) : null}
            {profileMsg.ok ? (
              <p className="text-sm text-[var(--accent-green)]">저장했습니다.</p>
            ) : null}
            <button
              type="submit"
              disabled={pendingProfile}
              className="btn btn-secondary rounded-md px-5 py-2 text-sm font-medium"
            >
              {pendingProfile ? '저장 중…' : '프로필 저장'}
            </button>
          </form>
        </div>
      </section>

      <section className="box">
        <div className="box-header">
          <h2 className="text-base font-semibold text-[var(--text-primary)]">
            비밀번호 변경
          </h2>
        </div>
        <div className="box-body">
          <form onSubmit={onPwSubmit} className="space-y-4 max-w-md">
            <div>
              <label className="block text-xs text-[var(--text-muted)] mb-1.5">
                현재 비밀번호
              </label>
              <input
                name="currentPassword"
                type="password"
                required
                autoComplete="current-password"
                className="input w-full"
              />
            </div>
            <div>
              <label className="block text-xs text-[var(--text-muted)] mb-1.5">
                새 비밀번호
              </label>
              <input
                name="newPassword"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                className="input w-full"
              />
            </div>
            {pwMsg.error ? (
              <p className="text-sm text-[var(--accent-red)]">{pwMsg.error}</p>
            ) : null}
            {pwMsg.ok ? (
              <p className="text-sm text-[var(--accent-green)]">
                비밀번호를 변경했습니다.
              </p>
            ) : null}
            <button
              type="submit"
              disabled={pendingPw}
              className="btn btn-secondary rounded-md px-5 py-2 text-sm font-medium"
            >
              {pendingPw ? '처리 중…' : '비밀번호 변경'}
            </button>
          </form>
        </div>
      </section>

      <section className="box">
        <div className="box-header">
          <h2 className="text-base font-semibold text-[var(--text-primary)]">
            통계 동기화
          </h2>
        </div>
        <div className="box-body">
          <p className="text-sm text-[var(--text-secondary)] mb-4">
            제출 기준으로 해결 수·레이팅을 다시 계산합니다. 데이터 불일치 시에만
            사용하세요.
          </p>
          <form action={syncStatsForCurrentUser}>
            <button type="submit" className="btn btn-ghost rounded-md px-5 py-2 text-sm font-medium">
              내 통계 재계산
            </button>
          </form>
        </div>
      </section>

      <section className="box">
        <div className="box-header">
          <h2 className="text-base font-semibold text-[var(--text-primary)]">
            도움말 및 정보
          </h2>
        </div>
        <div className="box-body">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/problems" className="flex items-center gap-3 px-4 py-3 rounded-xl border border-[var(--border-primary)] bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-strong)] no-underline transition-colors">
              <BookOpen size={16} />
              <div>
                <p className="text-sm font-medium">문제 목록</p>
                <p className="text-[11px] text-[var(--text-muted)] mt-0.5">모든 문제 둘러보기</p>
              </div>
            </Link>
            <Link href="/ranking" className="flex items-center gap-3 px-4 py-3 rounded-xl border border-[var(--border-primary)] bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-strong)] no-underline transition-colors">
              <Shield size={16} />
              <div>
                <p className="text-sm font-medium">랭킹</p>
                <p className="text-[11px] text-[var(--text-muted)] mt-0.5">순위 확인하기</p>
              </div>
            </Link>
            <Link href="/activity" className="flex items-center gap-3 px-4 py-3 rounded-xl border border-[var(--border-primary)] bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-strong)] no-underline transition-colors">
              <Mail size={16} />
              <div>
                <p className="text-sm font-medium">내 활동</p>
                <p className="text-[11px] text-[var(--text-muted)] mt-0.5">제출 내역 보기</p>
              </div>
            </Link>
            <Link href="/settings" className="flex items-center gap-3 px-4 py-3 rounded-xl border border-[var(--border-primary)] bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-strong)] no-underline transition-colors">
              <Shield size={16} />
              <div>
                <p className="text-sm font-medium">sco v0.1</p>
                <p className="text-[11px] text-[var(--text-muted)] mt-0.5">Online Judge Platform</p>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
