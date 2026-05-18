import { notFound } from 'next/navigation';
import ProblemsExplorerClient from '@/components/problems/ProblemsExplorerClient';
import { getCurrentUserOptional } from '@/lib/auth/current-user';
import {
  categoriesToNav,
  getCategoryBySlug,
  listCategoriesWithSubs,
  listProblems,
  listSolvedProblemNumbersForUser,
  toProblemListItemClient,
} from '@/lib/problems-db';

export default async function CategoryProblemsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const exists = await getCategoryBySlug(slug);
  if (!exists) notFound();

  const user = await getCurrentUserOptional();
  const [categories, rows, solvedNumbers] = await Promise.all([
    listCategoriesWithSubs(),
    listProblems({ categorySlug: slug }),
    listSolvedProblemNumbersForUser(user?.id ?? null),
  ]);

  return (
    <ProblemsExplorerClient
      categories={categoriesToNav(categories)}
      problems={rows.map(toProblemListItemClient)}
      activeCategorySlug={slug}
      solvedNumbers={solvedNumbers}
    />
  );
}
