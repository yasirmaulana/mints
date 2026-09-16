export default defineEventHandler(async (event) => {
  const { variantIds } = getQuery(event) as { variantIds?: string }
  if (!variantIds) return {}
  const ids = variantIds.split(',').filter(Boolean)
  if (!ids.length) return {}
  const variants = await prisma.productVariant.findMany({
    where: { id: { in: ids } },
    select: { id: true, stock: true }
  })
  const result: Record<string, number> = {}
  for (const v of variants) result[v.id] = v.stock
  return result
})
