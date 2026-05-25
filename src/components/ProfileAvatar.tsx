'use client';

import React, { useState } from 'react';
import { Camera, Link } from 'lucide-react';

import { uploadAvatarAction, updateProfileAction } from '@/app/actions/auth';

type Props = {
  src: string | null;
  initial: string;
  isOwner: boolean;
};

export default function ProfileAvatar({ src, initial, isOwner }: Props) {
  const [avatarSrc, setAvatarSrc] = useState(src);
  const [uploading, setUploading] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlValue, setUrlValue] = useState('');

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('avatar', file);
      const res = await uploadAvatarAction(fd);
      if (res?.error) {
        alert(res.error);
      } else if (res?.url) {
        setAvatarSrc(res.url);
      }
    } catch {
      alert('업로드 중 오류가 발생했습니다.');
    }
    setUploading(false);
  }

  async function handleUrlSubmit() {
    const url = urlValue.trim();
    if (!url) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('avatarUrl', url);
      fd.append('displayName', '');
      fd.append('bio', '');
      fd.append('organization', '');
      fd.append('githubUrl', '');
      fd.append('blogUrl', '');
      const res = await updateProfileAction(null, fd);
      if (res?.error) {
        alert(res.error);
      } else {
        setAvatarSrc(url);
        setShowUrlInput(false);
        setUrlValue('');
      }
    } catch {
      alert('URL 저장 중 오류가 발생했습니다.');
    }
    setUploading(false);
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="w-24 h-24 rounded-full overflow-hidden bg-[var(--bg-tertiary)] border-2 border-[var(--border-primary)] shadow-sm">
        {avatarSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={avatarSrc} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-[var(--text-muted)]">
            {initial}
          </div>
        )}
      </div>

      {isOwner && !showUrlInput && (
        <div className="flex flex-col items-center gap-1.5">
          <label className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] cursor-pointer transition-colors">
            <Camera size={12} />
            {uploading ? '업로드 중…' : '프로필 사진 변경'}
            <input
              type="file"
              accept="image/png,image/jpeg,image/gif,image/webp"
              className="hidden"
              onChange={handleFile}
              disabled={uploading}
            />
          </label>
          <button onClick={() => setShowUrlInput(true)} className="text-[11px] text-[var(--text-muted)] hover:text-[var(--accent-link)] transition-colors">
            <Link size={10} className="inline mr-1" />
            URL로 입력
          </button>
        </div>
      )}

      {isOwner && showUrlInput && (
        <div className="flex flex-col items-center gap-1.5 w-full">
          <input
            type="url"
            value={urlValue}
            onChange={(e) => setUrlValue(e.target.value)}
            placeholder="https://..."
            className="input w-full text-xs py-1 px-2"
          />
          <div className="flex gap-1.5">
            <button onClick={handleUrlSubmit} disabled={uploading} className="text-xs px-3 py-1 rounded bg-[var(--accent-link)] text-white font-medium">
              {uploading ? '저장 중…' : '저장'}
            </button>
            <button onClick={() => setShowUrlInput(false)} className="text-xs px-3 py-1 rounded text-[var(--text-muted)] hover:bg-[var(--bg-tertiary)]">
              취소
            </button>
          </div>
        </div>
      )}
    </div>
  );
}