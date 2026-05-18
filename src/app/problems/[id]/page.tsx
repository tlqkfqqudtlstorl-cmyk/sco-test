import { notFound } from 'next/navigation';
import ProblemDetailClient from '@/components/problems/ProblemDetailClient';
import { getCurrentUserOptional } from '@/lib/auth/current-user';
import {
  getProblemByRouteParam,
  getPrevNextProblem,
  listSolvedProblemNumbersForUser,
  mapRowToProblem,
  toProblemClient,
} from '@/lib/problems-db';

export default async function ProblemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const row = await getProblemByRouteParam(id);
  if (!row) notFound();

  const user = await getCurrentUserOptional();
  const problem = toProblemClient(mapRowToProblem(row));
  const solvedNumbers = await listSolvedProblemNumbersForUser(user?.id ?? null);
  const isSolved = solvedNumbers.includes(row.number);
  const { prev, next } = await getPrevNextProblem(row.number);

  return (
    <ProblemDetailClient
      problem={problem}
      categorySlug={row.category.slug}
      categoryName={row.category.name}
      subCategorySlug={row.subCategory?.slug ?? null}
      subCategoryName={row.subCategory?.name ?? null}
      isSolved={isSolved}
      isLoggedIn={!!user}
      prevProblem={prev ?? undefined}
      nextProblem={next ?? undefined}
    />
  );
}
