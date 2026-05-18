import ProblemsExplorerClient from '@/components/problems/ProblemsExplorerClient';
import { getCurrentUserOptional } from '@/lib/auth/current-user';
import {
  categoriesToNav,
  listCategoriesWithSubs,
  listProblems,
  listSolvedProblemNumbersForUser,
  toProblemListItemClient,
} from '@/lib/problems-db';

export default async function ProblemsPage() {
  const user = await getCurrentUserOptional();
  const [categories, rows, solvedNumbers] = await Promise.all([
    listCategoriesWithSubs(),
    listProblems(),
    listSolvedProblemNumbersForUser(user?.id ?? null),
  ]);

  return (
    <ProblemsExplorerClient
      categories={categoriesToNav(categories)}
      problems={rows.map(toProblemListItemClient)}
      solvedNumbers={solvedNumbers}
    />
  );
}
