import { notFound } from 'next/navigation';
import ProblemsExplorerClient from '@/components/problems/ProblemsExplorerClient';
import { getCurrentUserOptional } from '@/lib/auth/current-user';
import {
  assertSubCategoryPath,
  categoriesToNav,
  listCategoriesWithSubs,
  listProblems,
  listSolvedProblemNumbersForUser,
  toProblemListItemClient,
} from '@/lib/problems-db';

export default async function SubCategoryProblemsPage({
  params,
}: {
  params: Promise<{ slug: string; subSlug: string }>;
}) {
  const { slug, subSlug } = await params;
  const sub = await assertSubCategoryPath(slug, subSlug);
  if (!sub) notFound();

  const user = await getCurrentUserOptional();
  const [categories, rows, solvedNumbers] = await Promise.all([
    listCategoriesWithSubs(),
    listProblems({ categorySlug: slug, subCategorySlug: subSlug }),
    listSolvedProblemNumbersForUser(user?.id ?? null),
  ]);

  return (
    <ProblemsExplorerClient
      categories={categoriesToNav(categories)}
      problems={rows.map(toProblemListItemClient)}
      activeCategorySlug={slug}
      activeSubSlug={subSlug}
      solvedNumbers={solvedNumbers}
    />
  );
}
