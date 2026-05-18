import { getCurrentUserOptional } from '@/lib/auth/current-user';
import { prisma } from '@/lib/db';
import SettingsForms from '@/components/settings/SettingsForms';

export const metadata = {
  title: '설정',
};

export default async function SettingsPage() {
  const sessionUser = await getCurrentUserOptional();
  if (!sessionUser) return null;

  const full = await prisma.user.findUnique({
    where: { id: sessionUser.id },
    select: {
      email: true,
      displayName: true,
      bio: true,
      organization: true,
      githubUrl: true,
      blogUrl: true,
      avatarUrl: true,
    },
  });

  if (!full) return null;

  return (
    <div className="min-h-[calc(100dvh-3.5rem)] bg-[var(--bg-primary)]">
      <div className="container-app py-10 max-w-2xl">
        <header className="mb-8">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
            계정
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--text-primary)]">
            설정
          </h1>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            프로필은 공개 페이지에 표시됩니다. 이메일은 비공개입니다.
          </p>
        </header>

        <SettingsForms
          email={full.email}
          initial={{
            displayName: full.displayName ?? '',
            bio: full.bio ?? '',
            organization: full.organization ?? '',
            githubUrl: full.githubUrl ?? '',
            blogUrl: full.blogUrl ?? '',
            avatarUrl: full.avatarUrl ?? '',
          }}
        />
      </div>
    </div>
  );
}
