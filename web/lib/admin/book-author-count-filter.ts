import type { Prisma } from "@prisma/client";
import { Prisma as PrismaRuntime } from "@prisma/client";
import { db } from "@/lib/db";

export type AuthorCountFilter = "none" | "one" | "multiple";

export function parseAuthorCountFilter(
  value: string | null | undefined,
): AuthorCountFilter | undefined {
  if (value === "none" || value === "one" || value === "multiple") return value;
  return undefined;
}

async function productIdsByAuthorCount(
  filter: "one" | "multiple",
): Promise<string[]> {
  const having =
    filter === "one"
      ? PrismaRuntime.sql`COUNT(*) = 1`
      : PrismaRuntime.sql`COUNT(*) > 1`;

  const rows = await db.$queryRaw<Array<{ id: string }>>`
    SELECT pa."B" AS id
    FROM "_ProductAuthors" pa
    INNER JOIN products p ON p.id = pa."B"
    WHERE p.deleted_at IS NULL
    GROUP BY pa."B"
    HAVING ${having}
  `;

  return rows.map((r) => r.id);
}

export async function buildAuthorCountWhere(
  authorCount: AuthorCountFilter | undefined,
): Promise<Prisma.ProductWhereInput | undefined> {
  if (!authorCount) return undefined;

  if (authorCount === "none") {
    return { authors: { none: {} } };
  }

  const ids = await productIdsByAuthorCount(authorCount);
  return { id: { in: ids } };
}

export async function mergeAuthorCountIntoWhere(
  where: Prisma.ProductWhereInput,
  authorCount: AuthorCountFilter | undefined,
): Promise<Prisma.ProductWhereInput> {
  const authorWhere = await buildAuthorCountWhere(authorCount);
  if (!authorWhere) return where;
  return { AND: [where, authorWhere] };
}
